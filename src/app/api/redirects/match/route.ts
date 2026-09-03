import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Redirect from '@/models/Redirect';

export async function GET(req: NextRequest) {
  try {
    const urlParam = req.nextUrl.searchParams.get('url');
    if (!urlParam) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    await connectToDatabase();
    const redirects = await Redirect.find({ status: 'active' }).lean();

    // Helper to extract clean path and search
    const extractPathAndSearch = (inputUrl: string) => {
      let path = '';
      let search = '';
      try {
        const parsed = new URL(inputUrl, 'http://localhost');
        path = parsed.pathname;
        search = parsed.search;
      } catch {
        const qIndex = inputUrl.indexOf('?');
        if (qIndex !== -1) {
          path = inputUrl.substring(0, qIndex);
          search = inputUrl.substring(qIndex);
        } else {
          path = inputUrl;
        }
      }
      if (!path.startsWith('/')) path = '/' + path;
      return { path, search };
    };

    const stripTrailingSlash = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);

    const { path: reqPath, search: reqSearch } = extractPathAndSearch(urlParam);
    const requestUrlObj = new URL(urlParam, 'http://localhost');
    const requestParams = requestUrlObj.searchParams;

    for (const redirect of redirects) {
      let isMatch = false;
      let matchedTargetUrl = redirect.targetUrl;

      if (redirect.isRegex) {
        const flags = redirect.ignoreCase !== false ? 'i' : '';
        try {
          const regex = new RegExp(redirect.sourceUrl, flags);
          const pathMatch = reqPath.match(regex) || stripTrailingSlash(reqPath).match(regex);
          if (pathMatch) {
            isMatch = true;
            let replacedTarget = redirect.targetUrl;
            for (let i = 1; i < pathMatch.length; i++) {
              replacedTarget = replacedTarget.replace(new RegExp(`\\$${i}`, 'g'), pathMatch[i] || '');
            }
            matchedTargetUrl = replacedTarget;
          }
        } catch (e) {
          console.error(`Invalid regex in redirect ${redirect._id}:`, e);
        }
      } else {
        const { path: redPath, search: redSearch } = extractPathAndSearch(redirect.sourceUrl);
        const redirectUrlObj = new URL(redirect.sourceUrl, 'http://localhost');
        const redirectParams = redirectUrlObj.searchParams;

        let normReqPath = reqPath;
        let normRedPath = redPath;

        if (redirect.ignoreCase !== false) {
          normReqPath = normReqPath.toLowerCase();
          normRedPath = normRedPath.toLowerCase();
        }

        // Check exact match, stripped slash match, or case-insensitive stripped slash match
        const pathMatch =
          normReqPath === normRedPath ||
          stripTrailingSlash(normReqPath) === stripTrailingSlash(normRedPath) ||
          stripTrailingSlash(normReqPath).toLowerCase() === stripTrailingSlash(normRedPath).toLowerCase();

        if (pathMatch) {
          if (redirect.queryParamMode === 'ignore' || !redirect.queryParamMode) {
            isMatch = true;
          } else if (redirect.queryParamMode === 'pass') {
            isMatch = true;
            // Forward/preserve incoming query params
            if (reqSearch && reqSearch.length > 1) {
              const hasQuery = matchedTargetUrl.includes('?');
              const qs = reqSearch.startsWith('?') ? reqSearch.slice(1) : reqSearch;
              matchedTargetUrl = `${matchedTargetUrl}${hasQuery ? '&' : '?'}${qs}`;
            }
          } else if (redirect.queryParamMode === 'exact') {
            const reqKeys = Array.from(requestParams.keys()).sort();
            const redKeys = Array.from(redirectParams.keys()).sort();
            if (reqKeys.length === redKeys.length) {
              let keysMatch = true;
              for (let i = 0; i < reqKeys.length; i++) {
                const k = reqKeys[i];
                if (k !== redKeys[i]) {
                  keysMatch = false;
                  break;
                }
                const reqVal = redirect.ignoreCase !== false ? requestParams.get(k)?.toLowerCase() : requestParams.get(k);
                const redVal = redirect.ignoreCase !== false ? redirectParams.get(k)?.toLowerCase() : redirectParams.get(k);
                if (reqVal !== redVal) {
                  keysMatch = false;
                  break;
                }
              }
              if (keysMatch) {
                isMatch = true;
              }
            }
          } else {
            isMatch = true;
          }
        }
      }

      if (isMatch) {
        // Increment hits and last accessed date asynchronously
        Redirect.findByIdAndUpdate(redirect._id, {
          $inc: { hits: 1 },
          $set: { lastAccessed: new Date() }
        }).catch(err => console.error('Error updating redirect hits:', err));

        return NextResponse.json({
          targetUrl: matchedTargetUrl,
          statusCode: redirect.statusCode || 301
        });
      }
    }

    return NextResponse.json({ status: 'no_match' });
  } catch (error: any) {
    console.error('Redirect match API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
