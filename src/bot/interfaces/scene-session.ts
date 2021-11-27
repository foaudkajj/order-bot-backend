import { Scenes } from 'telegraf';

export interface SceneSession extends Scenes.SceneSessionData {
  // will be available under `ctx.scene.session.mySceneSessionProp`
  mySceneSessionProp: number;
}
