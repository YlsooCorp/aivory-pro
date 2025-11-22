import { TRPCError } from '@trpc/server';

import type { AixAPI_Access } from '~/modules/aix/server/api/aix.wiretypes';
import { GeminiWire_API_Models_List } from '~/modules/aix/server/dispatch/wiretypes/gemini.wiretypes';
import { fetchJsonOrTRPCThrow } from '~/server/trpc/trpc.router.fetchers';

import type { ModelDescriptionSchema } from './llm.server.types';
import { geminiAccess } from './gemini/gemini.router';
import {
  geminiDevCheckForParserMisses_DEV,
  geminiDevCheckForSuperfluousModels_DEV,
  geminiFilterModels,
  geminiModelToModelDescription,
  geminiModelsAddVariants,
  geminiSortModels,
} from './gemini/gemini.models';

export async function listModelsRunDispatch(access: AixAPI_Access, signal?: AbortSignal): Promise<ModelDescriptionSchema[]> {
  if (access.dialect !== 'gemini')
    throw new TRPCError({ code: 'BAD_REQUEST', message: `Unsupported dialect: ${access.dialect}` });

  const { headers, url } = geminiAccess(access, null, GeminiWire_API_Models_List.getPath, false);
  const wireModels = await fetchJsonOrTRPCThrow({ url, headers, name: 'Gemini', signal });
  const detailedModels = GeminiWire_API_Models_List.Response_schema.parse(wireModels).models;

  geminiDevCheckForParserMisses_DEV(wireModels, detailedModels);
  geminiDevCheckForSuperfluousModels_DEV(detailedModels.map(model => model.name));

  const filteredModels = detailedModels.filter(geminiFilterModels);
  const models = filteredModels
    .map(geminiModelToModelDescription)
    .filter((model): model is ModelDescriptionSchema => !!model)
    .sort(geminiSortModels);

  return geminiModelsAddVariants(models);
}
