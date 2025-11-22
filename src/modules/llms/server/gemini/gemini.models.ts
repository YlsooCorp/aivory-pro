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
