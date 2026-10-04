import { env } from '../config/env.js';
import { demoStore } from '../utils/demoStore.js';

export type LlmVariant = {
  variantNumber: number;
  caption: string;
  hashtags: string[];
  tone: string;
  reasoning: string;
};

export type LlmResult = { variants: LlmVariant[] };

function generateDemoVariants(brand: any, brief: string, examples: any[], imageDescription: string): LlmResult {
  const tone = brand?.brandTone ?? 'Professional';
  const style = brand?.preferredContentStyle ?? 'clean and high-converting';
  const examplesText = examples.length ? examples.map((ex) => ex.caption).join(' | ') : 'No prior approved examples yet.';

  const base = [
    {
      variantNumber: 1,
      caption: `${brief.charAt(0).toUpperCase() + brief.slice(1)} — crafted for ${brand?.brandName ?? 'your brand'} with a ${tone.toLowerCase()} voice and premium visual energy.`,
      hashtags: ['#BrandStory', '#CreatorEconomy', '#LaunchReady'],
      tone,
      reasoning: `Shows the product in a ${style.toLowerCase()} narrative while staying aligned with the brand’s ${tone.toLowerCase()} tone and the brief: ${brief}.`,
    },
    {
      variantNumber: 2,
      caption: `Built for the moment. ${brief} meets a sleek ${tone.toLowerCase()} message designed to stop the scroll and feel instantly premium.`,
      hashtags: ['#BuiltForMomentum', '#LaunchDay', '#SocialProof'],
      tone,
      reasoning: `Takes a more conversion-focused angle, balancing ${brand?.targetAudience ?? 'the target audience'} appeal with a high-contrast, platform-ready structure.`,
    },
    {
      variantNumber: 3,
      caption: `From concept to spotlight: ${brief}. A confident ${tone.toLowerCase()} story that highlights the product, the audience, and the feeling behind the launch.`,
      hashtags: ['#ModernBranding', '#ContentSystem', '#LaunchMoment'],
      tone,
      reasoning: `Creates a brand-led narrative with stronger emotional framing, using prior examples to maintain tone consistency while differentiating from the first two directions.`,
    },
  ];

  if (imageDescription) {
    base[0].reasoning += ` Image cue: ${imageDescription}.`;
    base[1].reasoning += ` Image cue: ${imageDescription}.`;
    base[2].reasoning += ` Image cue: ${imageDescription}.`;
  }

  if (examplesText && examplesText !== 'No prior approved examples yet.') {
    base[0].caption = `${base[0].caption} ${examplesText.slice(0, 50)}`;
  }

  return { variants: base };
}

export async function generateVariants({
  brand,
  brief,
  examples,
  imageDescription,
}: {
  brand: any;
  brief: string;
  examples: any[];
  imageDescription?: string;
}): Promise<LlmResult> {
  if (env.demoMode || env.aiProvider === 'demo') {
    return generateDemoVariants(brand, brief, examples, imageDescription ?? '');
  }

  if (!env.aiApiKey) {
    return generateDemoVariants(brand, brief, examples, imageDescription ?? '');
  }

  const prompt = `
You are BrandForge AI generating social content for a brand.
Brand:
${JSON.stringify(brand)}

Previous approved captions:
${examples.map((item) => `- ${item.caption}`).join('\n') || 'No previous approved captions yet.'}

User brief:
${brief}

Image description:
${imageDescription ?? 'No image analysis available.'}

Return STRICT JSON with keys: { "variants": [{ "variantNumber":1, "caption":"...", "hashtags":[...], "tone":"...", "reasoning":"..." }, ...] }.
Generate 3 substantially different but brand-consistent variants.
  `;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.aiApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error('AI provider failed');
    }

    const data = await response.json() as any;
    const content = data.content?.[0]?.text ?? '';
    const parsed = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] ?? '{"variants":[]}');
    return parsed as LlmResult;
  } catch (error) {
    return generateDemoVariants(brand, brief, examples, imageDescription ?? '');
  }
}

export async function generateImageVariation({
  imageUrl,
  brand,
  brief,
  platform,
}: {
  imageUrl: string;
  brand: any;
  brief: string;
  platform: string;
}) {
  if (env.demoMode || !env.imageApiKey) {
    return imageUrl;
  }

  try {
    const prompt = `Generate a background variation for a product image preserving the product and matching brand colors ${brand?.brandColors?.join(', ') ?? '#F4C95D,#1E3A8A'} and brief: ${brief}. Platform: ${platform}.`;
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.aiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
      }),
    });
    if (!response.ok) throw new Error('Image generation failed');
    const data = await response.json() as any;
    return data.data?.[0]?.url ?? imageUrl;
  } catch (error) {
    return imageUrl;
  }
}

export function getRelevantExamples(brandExamples: any[], brief: string, tone?: string) {
  return brandExamples.filter((example) => {
    const text = `${example.caption} ${example.hashtags.join(' ')} ${example.tone}`.toLowerCase();
    const briefLower = brief.toLowerCase();
    const toneMatch = tone ? example.tone?.toLowerCase() === tone.toLowerCase() : true;
    return toneMatch && (text.includes(briefLower) || briefLower.includes(example.caption.toLowerCase().slice(0, 20)) || example.tone?.toLowerCase() === tone?.toLowerCase());
  }).slice(0, 3);
}

export function createDemoBrandImageUrl(brandName: string, variantNumber: number) {
  const colors = ['#F4C95D', '#1E3A8A', '#0A0A0A', '#E2E8F0'];
  const color = colors[(variantNumber + brandName.length) % colors.length];
  return `https://placehold.co/1200x1200/${color.replace('#', '')}/ffffff?text=${encodeURIComponent(brandName)}`;
}
