import { Scenes } from 'telegraf';

export interface WizardSession extends Scenes.WizardSessionData {
  // will be available under `ctx.scene.session.myWizardSessionProp`
  isLocation: boolean;
  longitude: any;
  latitude: any;
  address: any;
}
