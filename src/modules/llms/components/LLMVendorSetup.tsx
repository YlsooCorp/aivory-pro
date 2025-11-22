import * as React from 'react';

import type { DModelsService, DModelsServiceId } from '~/common/stores/llms/llms.service.types';

import { findModelVendor, ModelVendorId } from '../vendors/vendors.registry';

import { GeminiServiceSetup } from '../vendors/gemini/GeminiServiceSetup';

/**
 * Add to this map to register a new Vendor Setup Component.
 * NOTE: we do it here to only depend on this file (even lazily) and avoid to import all the Components (UI)
 *       code on vendor definitions (which must be lightweight as it impacts boot time).
 */
const vendorSetupComponents: Record<ModelVendorId, React.ComponentType<{ serviceId: DModelsServiceId }>> = {
  googleai: GeminiServiceSetup,
} as const;

export function LLMVendorSetup(props: { service: DModelsService }) {
  const vendor = findModelVendor(props.service.vId);
  if (!vendor)
    return 'Configuration issue: Vendor not found for Service ' + props.service.id;

  const SetupComponent = vendorSetupComponents[vendor.id];
  if (!SetupComponent)
    return 'Configuration issue: Setup component not found for vendor ' + vendor.id;

  return <SetupComponent key={props.service.id} serviceId={props.service.id} />;
}
