import type { GeminiWire_API_Models_List } from '~/modules/aix/server/dispatch/wiretypes/gemini.wiretypes';

import type { ModelDescriptionSchema } from '../llm.server.types';

import { LLM_IF_GEM_CodeExecution, LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_OAI_Vision } from '~/common/stores/llms/llms.types';
import { Release } from '~/common/app.release';

const DEV_DEBUG_GEMINI_MODELS = (Release.TenantSlug as any) === 'staging' || Release.IsNodeDevBuild;

const GEMINI_ALLOWED_MODELS: Array<{
  prefix: string;
  label: string;
  interfaces: ModelDescriptionSchema['interfaces'];
  chatPrice: ModelDescriptionSchema['chatPrice'];
}> = [

// supported interfaces
const geminiChatInterfaces: GeminiWire_API_Models_List.Model['supportedGenerationMethods'] = ['generateContent'];

// unsupported interfaces
const filterUnallowedNames = ['Legacy'];
// const filterUnallowedInterfaces: GeminiWire_API_Models_List.Model['supportedGenerationMethods'] = [
//   'generateAnswer',     // e.g. removes "models/aqa"
//   'embedContent',       // e.g. removes "models/embedding-001"
//   'embedText',          // e.g. removes "models/text-embedding-004"
//   'predict',            // e.g. removes "models/imagen-3.0-generate-002" (appeared on 2025-02-09)
//   'predictLongRunning', // e.g. removes "models/veo-2.0-generate-001" (appeared on 2025-04-10)
// ];
const filterLyingModelNames: GeminiWire_API_Models_List.Model['name'][] = [
  // new symlinks that are too vague and high risk; let the user pick the correct model
  'models/gemini-pro-latest',
  'models/gemini-flash-latest',
  'models/gemini-flash-lite-latest',

  // 2025-02-27: verified, old model is no more
  'models/gemini-2.0-flash-exp', // verified, replaced by gemini-2.0-flash, which is non-free anymore

  // 2025-02-09 update: as of now they cleared the list, so we restart
  // 2024-12-10: name of models that are not what they say they are (e.g. 1114 is actually 1121 as of )
  'models/gemini-1.5-flash-8b-exp-0924', // replaced by non-free
  'models/gemini-1.5-flash-8b-exp-0827', // replaced by non-free
];


/* Manual models details
   Gemini Name Mapping example:
   - Latest version    gemini-1.0-pro-latest    <model>-<generation>-<variation>-latest
   - Latest stable     version  gemini-1.0-pro  <model>-<generation>-<variation>
   - Stable versions   gemini-1.0-pro-001       <model>-<generation>-<variation>-<version>

   Gemini capabilities chart (updated 2025-11-01):
   - [table stakes] System instructions
   - JSON Mode, with optional JSON Schema
   - Adjustable Safety Settings
   - Caching
   - Tuning
   - Function calling, with configuration
   - Code execution
   - Thinking / Reasoning with thinking budget
   - Audio generation
   - Live API
   - Native Audio (dialog models)
   - Text-to-Speech models
*/

// Experimental Gemini models are Free of charge
const geminiExpFree: ModelDescriptionSchema['chatPrice'] = {
  input: 'free', output: 'free',
};


// Pricing based on https://ai.google.dev/pricing (Nov 20, 2025)

const gemini30ProPricing: ModelDescriptionSchema['chatPrice'] = {
  input: [{ upTo: 200000, price: 2.00 }, { upTo: null, price: 4.00 }],
  output: [{ upTo: 200000, price: 12.00 }, { upTo: null, price: 18.00 }],
  cache: { cType: 'oai-ac', read: [{ upTo: 200000, price: 0.20 }, { upTo: null, price: 0.40 }] },
};

const gemini30ProImagePricing: ModelDescriptionSchema['chatPrice'] = {
  input: 2.00, // text input (flat rate, no tiers)
  output: 12.00, // text/thinking output (flat rate, no tiers)
  // NOTE: Additional image-specific pricing (not yet supported in schema):
  // - Image input: $0.0011/image (560 tokens = $0.067/image)
  // - Image output: $0.134/image (1K/2K, 1120 tokens) or $0.24/image (4K, 2000 tokens)
};

const gemini25ProPricing: ModelDescriptionSchema['chatPrice'] = {
  input: [{ upTo: 200000, price: 1.25 }, { upTo: null, price: 2.50 }],
  output: [{ upTo: 200000, price: 10.00 }, { upTo: null, price: 15.00 }],
  cache: { cType: 'oai-ac', read: [{ upTo: 200000, price: 0.31 }, { upTo: null, price: 0.625 }] },
};

const gemini25FlashPricing: ModelDescriptionSchema['chatPrice'] = {
  input: 0.30, // text/image/video; audio is $1.00 but we don't differentiate yet
  output: 2.50, // including thinking tokens
  cache: { cType: 'oai-ac', read: 0.075 }, // text/image/video; audio is $0.25 but we don't differentiate yet
};

const gemini25FlashPreviewPricing = gemini25FlashPricing; // The latest model based on the 2.5 Flash model. 2.5 Flash Preview is best for large scale processing, low-latency.

const gemini25FlashLitePricing: ModelDescriptionSchema['chatPrice'] = {
  input: 0.10, // text/image/video; audio is $0.30 but we don't differentiate yet
  output: 0.40, // including thinking tokens
  cache: { cType: 'oai-ac', read: 0.025 }, // text/image/video; audio is $0.125 but we don't differentiate yet
};

const gemini25FlashLitePreviewPricing = gemini25FlashLitePricing; // The latest model based on Gemini 2.5 Flash lite optimized for cost-efficiency, high throughput and high quality.

// REMOVED: gemini25FlashNativeAudioPricing (dialog models no longer supported)

const gemini25FlashPreviewTTSPricing: ModelDescriptionSchema['chatPrice'] = {
  input: 0.50, // text input
  // output: 10.00, // AUDIO - not ready for audio output yet, as of 2025-05-27
};

const gemini25ProPreviewTTSPricing: ModelDescriptionSchema['chatPrice'] = {
  input: 1.00, // text input
  // output: 20.00, // AUDIO - not ready for audio output yet, as of 2025-05-27
};

const gemini20FlashPricing: ModelDescriptionSchema['chatPrice'] = {
  input: 0.10, // text/image/video; audio is $0.70 but we don't differentiate yet
  output: 0.40,
  // Implicit caching is only available in 2.5 models for now. cache: { cType: 'oai-ac', read: 0.025 }, // text/image/video; audio is $0.175 but we don't differentiate yet
  // Image generation pricing: 0.039 - Image output is priced at $30 per 1,000,000 tokens. Output images up to 1024x1024px consume 1290 tokens and are equivalent to $0.039 per image.
};

const gemini20FlashLivePricing: ModelDescriptionSchema['chatPrice'] = {
  input: 0.35, // text; audio/video is $2.10 but we don't differentiate yet
  output: 1.50, // text; audio is $8.50 but we don't differentiate yet
};

const gemini20FlashLitePricing: ModelDescriptionSchema['chatPrice'] = {
  input: 0.075,
  output: 0.30,
};



const IF_25 = [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_OAI_Reasoning, LLM_IF_GEM_CodeExecution, LLM_IF_OAI_PromptCaching];
const IF_30 = [LLM_IF_HOTFIX_NoTemperature /* vital: the Gemini 3 Developers Guide strongly recommending keeping it at 1 (aka not setting it) */, ...IF_25];
const IF_30_IMG = [...IF_30, LLM_IF_Outputs_Image];


const _knownGeminiModels: ({
  id: string,
  labelOverride?: string,
  isPreview?: boolean,
  symLink?: string,
  deprecated?: string, // Gemini may provide deprecation dates
  // _delete removed - models are now physically removed from the list instead of marked for deletion
} & Pick<ModelDescriptionSchema, 'interfaces' | 'parameterSpecs' | 'chatPrice' | 'hidden' | 'benchmark'>)[] = [

  /// Generation 3.0

  // 3.0 Pro (Preview) - Released November 18, 2025
  {
    id: 'models/gemini-3-pro-preview',
    labelOverride: 'Gemini 3 Pro Preview',
    isPreview: true,
    chatPrice: gemini30ProPricing,
    interfaces: IF_30,
    parameterSpecs: [
      { paramId: 'llmVndGeminiThinkingLevel' /* replaces thinking_budget for Gemini 3 */ },
      { paramId: 'llmVndGeminiMediaResolution' },
      { paramId: 'llmVndGeminiCodeExecution' },
      { paramId: 'llmVndGeminiGoogleSearch' },
    ],
    benchmark: { cbaElo: 1498 }, // gemini-3-pro (preliminary)
  },

  // 3.0 Pro Image Preview - Released November 20, 2025
  {
    id: 'models/gemini-3-pro-image-preview',
    labelOverride: 'Nano Banana Pro', // Marketing name for the technical model ID
    isPreview: true,
    chatPrice: gemini30ProImagePricing,
    interfaces: IF_30_IMG,
    parameterSpecs: [
      // { paramId: 'llmVndGeminiShowThoughts' },
      { paramId: 'llmVndGeminiGoogleSearch' },
      { paramId: 'llmVndGeminiAspectRatio' },
      { paramId: 'llmVndGeminiImageSize' },
    ],
    benchmark: undefined, // Non-benchmarkable because generates images
  },
  {
    id: 'models/nano-banana-pro-preview',
    labelOverride: 'Nano Banana Pro',
    symLink: 'models/gemini-3-pro-image-preview',
    // copied from symlink
    isPreview: true,
    chatPrice: gemini30ProImagePricing,
    interfaces: IF_30_IMG,
    parameterSpecs: [
      // { paramId: 'llmVndGeminiShowThoughts' },
      { paramId: 'llmVndGeminiGoogleSearch' },
      { paramId: 'llmVndGeminiAspectRatio' },
      { paramId: 'llmVndGeminiImageSize' },
    ],
    benchmark: undefined, // Non-benchmarkable because generates images
  },

  /// Generation 2.5

  // 2.5 Pro (Stable) - Released June 17, 2025
  {
    id: 'models/gemini-2.5-pro',
    labelOverride: 'Gemini 2.5 Pro',
    chatPrice: gemini25ProPricing,
    interfaces: IF_25,
    parameterSpecs: [
      { paramId: 'llmVndGeminiThinkingBudget', rangeOverride: [128, 32768] /* does not support 0 which would turn thinking off */ },
      { paramId: 'llmVndGeminiGoogleSearch' },
    ],
    benchmark: { cbaElo: 1451 }, // gemini-2.5-pro
  },
  {
    hidden: true, // show the final stable version instead
    id: 'models/gemini-2.5-pro-preview-06-05',
    labelOverride: 'Gemini 2.5 Pro Preview 06-05', // overriding because the API does not have the version on this
    isPreview: true,
    chatPrice: gemini25ProPricing,
    interfaces: IF_25,
    parameterSpecs: [{ paramId: 'llmVndGeminiThinkingBudget', rangeOverride: [128, 32768] /* does not support 0 which would turn thinking off */ }],
    // benchmark: { cbaElo: 1467 }, // commented out, yielding to the final versions
  },
  {
    id: 'models/gemini-2.5-pro-preview-05-06',
    isPreview: true,
    chatPrice: gemini25ProPricing,
    interfaces: IF_25,
    // benchmark: { cbaElo: 1446 },
    hidden: true, // superseded by 06-05 version
  },
  {
    id: 'models/gemini-2.5-pro-preview-03-25',
    isPreview: true,
    chatPrice: gemini25ProPricing,
    interfaces: IF_25,
    // parameterSpecs: [{ paramId: 'llmVndGeminiShowThoughts' }], // Gemini doesn't show thoughts anymore
    // benchmark: { cbaElo: 1439 },
    hidden: true, // hard-superseded, but keeping this as non-symlink in case Gemini restores it
  },

  // 2.5 Pro Preview TTS
  {
    hidden: true, // single-turn-only model - unhide and just send a message to make use of this
    id: 'models/gemini-2.5-pro-preview-tts',
    isPreview: true,
    chatPrice: gemini25ProPreviewTTSPricing,
    interfaces: [
      LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json,
      LLM_IF_Outputs_Audio, LLM_IF_Outputs_NoText,
      LLM_IF_HOTFIX_StripSys0, // TTS: no system instruction
      LLM_IF_HOTFIX_NoStream, // TTS: no streaming - use generateContent instead
    ],
    benchmark: undefined, // TTS models are not benchmarkable
    // hidden: true, // audio outputs are unavailable as of 2025-05-27
  },

  // 2.5 Flash (Stable) - Released June 17, 2025
  {
    id: 'models/gemini-2.5-flash-preview-09-2025',
    labelOverride: 'Gemini 2.5 Flash Preview 09-2025',
    isPreview: true,
    chatPrice: gemini25FlashPreviewPricing,
    interfaces: IF_25,
    parameterSpecs: [
      { paramId: 'llmVndGeminiThinkingBudget' },
      { paramId: 'llmVndGeminiGoogleSearch' },
    ],
    benchmark: { cbaElo: 1406 + 2 }, // gemini-2.5-flash-preview-09-2025 - the +2 is to be on top of the non-preview 2.5-flash (1407)
  },
  {
    hidden: true, // yielding to 'models/gemini-2.5-flash-preview-09-2025', which is more recent
    id: 'models/gemini-2.5-flash',
    labelOverride: 'Gemini 2.5 Flash',
    chatPrice: gemini25FlashPricing,
    interfaces: IF_25,
    parameterSpecs: [
      { paramId: 'llmVndGeminiThinkingBudget' },
      { paramId: 'llmVndGeminiGoogleSearch' },
    ],
    benchmark: { cbaElo: 1407 }, // gemini-2.5-flash (updated from CSV)
  },

  // REMOVED MODELS (no longer returned by API as of Nov 20, 2025):
  // - models/gemini-2.5-flash-preview-05-20 (superseded by 09-2025 version)

  // 2.5 Pro-Based: Gemini Computer Use Preview - Released October 7, 2025
  // IMPORTANT: This model requires CLIENT-SIDE browser automation implementation
  // - Ylsoo Aivory (web-only) cannot execute Computer Use actions (screenshots, clicks, typing)
  // - Users must implement external client-side code to:
  //   1. Capture screenshots and send to model
  //   2. Receive function_call responses (click_at, type_text_at, etc.)
  //   3. Execute actions in browser and capture new screenshots
  //   4. Handle safety_decision fields (require_confirmation → must prompt user per ToS)
  //   5. Denormalize coordinates from 0-999 grid to actual screen dimensions
  // - Reference implementation: https://github.com/google/computer-use-preview
  // - Docs: https://ai.google.dev/gemini-api/docs/computer-use
  {
    id: 'models/gemini-2.5-computer-use-preview-10-2025',
    labelOverride: 'Gemini 2.5 Computer Use Preview 10-2025',
    isPreview: true,
    chatPrice: gemini25ProPricing, // Uses same pricing as 2.5 Pro (pricing page doesn't list separately)
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_OAI_Reasoning, LLM_IF_GEM_CodeExecution],
    parameterSpecs: [
      { paramId: 'llmVndGeminiThinkingBudget' },
      { paramId: 'llmVndGeminiComputerUse' }, // Sets environment=ENVIRONMENT_BROWSER in Computer Use tool
    ],
    benchmark: undefined, // Computer use model, not benchmarkable on standard tests
    hidden: true, // Hidden: requires external client-side implementation not available in Ylsoo Aivory
  },

  // 2.5 Flash-Based: Gemini Robotics-ER 1.5 Preview - Released September 25, 2025
  {
    id: 'models/gemini-robotics-er-1.5-preview',
    labelOverride: 'Gemini Robotics-ER 1.5 Preview',
    isPreview: true,
    chatPrice: gemini25FlashPricing, // Uses same pricing as 2.5 Flash per pricing page
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_OAI_Reasoning],
    parameterSpecs: [{ paramId: 'llmVndGeminiThinkingBudget' }],
    benchmark: undefined, // Robotics model, not benchmarkable on standard tests
  },

  // 2.5 Flash Image Preview
  {
    id: 'models/gemini-2.5-flash-image',
    labelOverride: 'Nano Banana',
    chatPrice: { input: 0.30, output: undefined }, // Per pricing page: $0.30 text/image input, $0.039 per image output, but the text output is not stated
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_Outputs_Image],
    parameterSpecs: [{ paramId: 'llmVndGeminiAspectRatio' }],
    benchmark: undefined, // Non-benchmarkable because generates images
  },
  // 2.5 Flash Image Preview
  {
    hidden: true, // superseded by 'models/gemini-2.5-flash-image'
    id: 'models/gemini-2.5-flash-image-preview',
    labelOverride: 'Gemini 2.5 Flash Image Preview', // default is Nano Banana
    isPreview: true,
    chatPrice: { input: 0.30, output: undefined }, // Per pricing page: $0.30 text/image input, $0.039 per image output, but the text output is not stated
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_Outputs_Image],
    benchmark: undefined, // Non-benchmarkable because generates images
  },

  // REMOVED MODELS (no longer returned by API as of Sept 16, 2025):
  // - models/gemini-2.5-flash-preview-04-17 (superseded by 05-20 version)
  // - models/gemini-2.5-flash-preview-04-17-thinking (Cursor variant, superseded)


  // 2.5 Flash Preview TTS
  {
    hidden: true, // audio outputs are unavailable as of 2025-05-27
    id: 'models/gemini-2.5-flash-preview-tts',
    isPreview: true,
    chatPrice: gemini25FlashPreviewTTSPricing,
    interfaces: [
      LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json,
      LLM_IF_Outputs_Audio, LLM_IF_Outputs_NoText,
      LLM_IF_HOTFIX_StripSys0, // TTS: no system instruction
      LLM_IF_HOTFIX_NoStream, // TTS: no streaming - use generateContent instead
    ],
    benchmark: undefined, // TTS models are not benchmarkable
  },

  // REMOVED MODELS (dialog models unsupported as of 2025-05-27):
  // - models/gemini-2.5-flash-preview-native-audio-dialog
  // - models/gemini-2.5-flash-exp-native-audio-thinking-dialog


  // 2.5 Flash-Lite

  /// 2.5 Flash-Lite Preview - Released September 25, 2025
  {
    id: 'models/gemini-2.5-flash-lite-preview-09-2025',
    labelOverride: 'Gemini 2.5 Flash-Lite Preview 09-2025',
    isPreview: true,
    chatPrice: gemini25FlashLitePreviewPricing,
    interfaces: IF_25,
    parameterSpecs: [
      { paramId: 'llmVndGeminiThinkingBudget' },
      { paramId: 'llmVndGeminiGoogleSearch' },
    ],
    benchmark: { cbaElo: 1380 }, // gemini-2.5-flash-lite-preview-09-2025 (no-thinking variant)
  },
  // 2.5 Flash-Lite (Stable) - Released July 2025
  {
    hidden: true, // yielding to 'models/gemini-2.5-flash-lite', which is stable now
    id: 'models/gemini-2.5-flash-lite',
    labelOverride: 'Gemini 2.5 Flash-Lite',
    chatPrice: gemini25FlashLitePricing,
    interfaces: IF_25,
    parameterSpecs: [
      { paramId: 'llmVndGeminiThinkingBudget' },
      { paramId: 'llmVndGeminiGoogleSearch' },
    ],
    benchmark: { cbaElo: 1310 }, // Based on 2.0 Flash-Lite performance
  },

  // REMOVED MODELS (no longer returned by API as of Nov 20, 2025):
  // - models/gemini-2.5-flash-lite-preview-06-17 (superseded by 09-2025 version)


  /// Generation 2.0

  // 2.0 Pro Experimental (Superseded by 2.5 Pro Preview/Exp)
  {
    hidden: true, // superseded by 'models/gemini-2.5-pro-preview-03-25', but not fully removed yet
    id: 'models/gemini-2.0-pro-exp-02-05', // Base model: Gemini 2.0 Pro
    isPreview: true,
    chatPrice: geminiExpFree,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_GEM_CodeExecution],
    benchmark: { cbaElo: 1380 },
  },
  {
    hidden: true, // only keeping the latest
    id: 'models/gemini-2.0-pro-exp',
    symLink: 'models/gemini-2.0-pro-exp-02-05',
    // copied from symlink
    isPreview: true,
    chatPrice: geminiExpFree,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_GEM_CodeExecution],
    benchmark: { cbaElo: 1380 },
  },
  {
    hidden: true,
    // _delete: true, // replaced by gemini-2.0-pro-exp-02-05, 2025-02-27: verified, old model is no more
    id: 'models/gemini-exp-1206',
    labelOverride: 'Gemini 2.0 Pro Experimental 1206',
    isPreview: true,
    chatPrice: geminiExpFree,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_GEM_CodeExecution],
    benchmark: { cbaElo: 1374 },
  },

  // 2.0 Flash Live
  {
    id: 'models/gemini-2.0-flash-live-001',
    labelOverride: 'Gemini 2.0 Flash Live',
    chatPrice: gemini20FlashLivePricing,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Vision, LLM_IF_OAI_Fn, LLM_IF_OAI_Json, LLM_IF_Outputs_Audio, LLM_IF_GEM_CodeExecution],
    isPreview: true,
    // benchmark: not available because of the Live API (non benchmarkable)
  },

  // 2.0 Flash Thinking Experimental (superseded by 2.5 Flash Preview, but we still show it because it's free)
  {
    prefix: 'models/gemini-2.5-flash-preview',
    label: 'Gemini 2.5 Flash Preview',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Vision, LLM_IF_OAI_Json, LLM_IF_GEM_CodeExecution],
    chatPrice: { input: 0.30, output: 2.50, cache: { cType: 'oai-ac', read: 0.075 } },
  },
  {
    prefix: 'models/gemini-2.5-flash-lite-preview',
    label: 'Gemini 2.5 Flash Lite Preview',
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Vision, LLM_IF_OAI_Json, LLM_IF_GEM_CodeExecution],
    chatPrice: { input: 0.10, output: 0.40, cache: { cType: 'oai-ac', read: 0.025 } },
  },
];

const allowedPrefixes = GEMINI_ALLOWED_MODELS.map(model => model.prefix);

export function geminiDevCheckForSuperfluousModels_DEV(apiModelIds: string[]): void {
  if (!DEV_DEBUG_GEMINI_MODELS)
    return;

  const missing = allowedPrefixes.filter(prefix => !apiModelIds.some(id => id.startsWith(prefix)));
  if (missing.length)
    console.log(`[DEV] Gemini: allowed models missing from API response: [ ${missing.join(', ')} ]`);
}

export function geminiDevCheckForParserMisses_DEV(wireModels: unknown, parsedModels: object[]): void {
  if (!DEV_DEBUG_GEMINI_MODELS)
    return;

  if (!wireModels || !Array.isArray((wireModels as any)?.models))
    console.log('[DEV] Gemini: wireModels.models is not an array', wireModels);
  else if ((wireModels as any).models.length !== parsedModels.length)
    console.log('[DEV] Gemini: parsed models length mismatch', wireModels, parsedModels);
}

export function geminiFilterModels(geminiModel: GeminiWire_API_Models_List.Model): boolean {
  return allowedPrefixes.some(prefix => geminiModel.name.startsWith(prefix));
}

export function geminiSortModels(a: ModelDescriptionSchema, b: ModelDescriptionSchema): number {
  const aIdx = allowedPrefixes.findIndex(prefix => a.id.startsWith(prefix));
  const bIdx = allowedPrefixes.findIndex(prefix => b.id.startsWith(prefix));
  if (aIdx !== bIdx)
    return aIdx - bIdx;
  return a.label.localeCompare(b.label);
}

export function geminiModelToModelDescription(geminiModel: GeminiWire_API_Models_List.Model): ModelDescriptionSchema | null {
  const matched = GEMINI_ALLOWED_MODELS.find(model => geminiModel.name.startsWith(model.prefix));
  if (!matched)
    return null;

  const { description, displayName, name: modelId, supportedGenerationMethods, inputTokenLimit, outputTokenLimit } = geminiModel;
  const label = `${matched.label}${modelId === matched.prefix ? '' : ` (${displayName})`}`;
  const descriptionLong = (description || 'No description.') +
    ` (Version: ${geminiModel.version}, Defaults: temperature=${geminiModel.temperature}, topP=${geminiModel.topP}, topK=${geminiModel.topK}, interfaces=[${supportedGenerationMethods.join(',')}])`;

  return {
    id: modelId,
    label,
    description: descriptionLong,
    contextWindow: inputTokenLimit + outputTokenLimit,
    maxCompletionTokens: outputTokenLimit,
    interfaces: matched.interfaces,
    parameterSpecs: undefined,
    benchmark: undefined,
    chatPrice: matched.chatPrice,
    hidden: false,
  };
}

export function geminiModelsAddVariants(models: ModelDescriptionSchema[]): ModelDescriptionSchema[] {
  return models;
}
