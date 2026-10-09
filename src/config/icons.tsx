import React from 'react';
import {
  Home, Building2, Wrench, Star, Shield, Clock, Mail, Phone, MapPin, Calendar,
  ArrowRight, Check, X, Menu, ChevronDown, ChevronRight, ChevronLeft,
  Facebook, Twitter, Instagram, Linkedin, Youtube, Award, Sparkles, Flag,
  Users, Briefcase, MessageSquare, FileText, Image as ImageIcon, CreditCard, DollarSign,
  ThumbsUp, User, Send, ClipboardCheck, TreePine, Droplets, Hammer, Sun,
  CloudRain, Layout, Square, Building, Plus, Minus, Search, Infinity as InfinityIcon,
  Volume2, VolumeX, Play, Pause, ChevronUp, Quote, CheckCircle, Gem,
  Globe, Scale, ShieldCheck, Target, TrendingUp, Zap, BadgeCheck, Lock,
  MessageCircle, Info, ShoppingBag, AlertCircle, Truck, Copyright,
  HelpCircle, CircleHelp
} from 'lucide-react';

// For Google, we can use a custom icon
const Google = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

// We keep a static map for custom icons, aliases, and direct imports to maintain backwards compatibility
export const iconMap: Record<string, any> = {
    Home,
    Building2,
    Wrench,
    Star,
    Shield,
    Clock,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ArrowRight,
    Check,
    X,
    Menu,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Award,
    Sparkles,
    Flag,
    Users,
    Briefcase,
    MessageSquare,
    FileText,
    Image: ImageIcon,
    CreditCard,
    DollarSign,
    ThumbsUp,
    User,
    Send,
    ClipboardCheck,
    TreePine,
    Droplets,
    Hammer,
    Sun,
    CloudRain,
    Layout,
    Square,
    Building,
    Plus,
    Minus,
    Search,
    Infinity: InfinityIcon,
    Volume2,
    VolumeX,
    Play,
    Pause,
    ChevronUp,
    Google,
    Quote,
    CheckCircle,
    Gem,
    Globe,
    Scale,
    ShieldCheck,
    Target,
    TrendingUp,
    Zap,
    BadgeCheck,
    Lock,
    MessageCircle,
    Info,
    ShoppingBag,
    AlertCircle,
    Truck,
    Copyright,
    // Aliases for alternate naming used in data files
    Warranty: Shield,
    LinkedIn: Linkedin,
    Verified: BadgeCheck,
    Chat: MessageCircle,
};

// Helper component to render icons with full tree-shaking
export const Icon = ({ name, className = "w-5 h-5", ...props }: {
    name: string;
    className?: string;
    [key: string]: any;
}) => {
    if (!name) {
        return null;
    }

    // Strip "Lucide" or "lucide-" prefixes if present
    let cleanName = name;
    if (cleanName.startsWith('Lucide')) {
        cleanName = cleanName.substring(6);
    } else if (cleanName.startsWith('lucide-')) {
        cleanName = cleanName.substring(7)
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
    }

    const capitalizedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    const IconComponent = iconMap[cleanName] || iconMap[capitalizedName] || CircleHelp || HelpCircle || Star;

    return React.createElement(IconComponent, { className, ...props });
};