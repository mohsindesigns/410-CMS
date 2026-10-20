import {
  Activity, Award, BadgeCheck, CalendarCheck, Clock, Dumbbell, Flame, Gem, HeartPulse,
  Hand, Leaf, MapPin, Medal, ShieldCheck, Sparkles, Star, Target, ThumbsUp, Timer,
  TrendingUp, Users, Waves, Zap, Stethoscope, Smile, Sun, Droplets, Brain, Bone, Heart,
  Handshake, Phone, Calendar, CheckCircle2, Crown, Trophy, Sprout, Wind, Thermometer,
  Move, Shield, Layers, Compass, Lightbulb,
  type LucideIcon,
} from "lucide-react";

/**
 * Curated icon set for the "Feature Cards" home section. The public component and the dashboard
 * picker both read this list, so every icon you can pick is guaranteed to render, and the site
 * bundle doesn't have to ship the entire lucide library.
 */
export const FEATURE_ICONS: Record<string, LucideIcon> = {
  Activity, Award, BadgeCheck, CalendarCheck, Clock, Dumbbell, Flame, Gem, HeartPulse,
  Hand, Leaf, MapPin, Medal, ShieldCheck, Sparkles, Star, Target, ThumbsUp, Timer,
  TrendingUp, Users, Waves, Zap, Stethoscope, Smile, Sun, Droplets, Brain, Bone, Heart,
  Handshake, Phone, Calendar, CheckCircle2, Crown, Trophy, Sprout, Wind, Thermometer,
  Move, Shield, Layers, Compass, Lightbulb,
};

export const FEATURE_ICON_NAMES = Object.keys(FEATURE_ICONS);
