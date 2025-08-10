## Input Parameters:

- Base Color: CSS hex value (e.g., #f1f2f3)
- Mood: One of 10 predefined options including Calm, Energetic, Professional, Playful, Sophisticated, Fresh, Warm, Cool, Bold, and Subtle

## Algorithm Design:

1.  Converts hex to RGB and then to HSL for easier manipulation
2.  Applies mood-specific rules to generate complementary colors
3.  Creates 5-7 color variations including primary, secondary, accent, background, and text colors
4.  Each mood defines specific Hue, Saturation, and Lightness modifications
5.  Ensures accessibility standards with proper contrast ratios

## Mood-Specific Rules:

Calm: Soft pastels, low saturation, light hues
Energetic: High contrast, vibrant colors, high saturation
Professional: Neutral tones, balanced saturation, muted colors
Playful: Bright, saturated colors, varied hues
Sophisticated: Deep, rich colors, high saturation with elegance
Fresh: Light, clean colors, low saturation, cool tones
Warm: Red/orange/yellow hues, high saturation
Cool: Blue/green hues, low saturation
Bold: High contrast, intense saturation, strong hues
Subtle: Low saturation, minimal contrast, soft variations
