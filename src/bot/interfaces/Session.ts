import {Scenes} from 'telegraf';
import {SceneSession} from './SceneSession';

export interface Session extends Scenes.SceneSession<SceneSession> {
  // will be available under `ctx.session.mySessionProp`
  mySessionProp: number;
}
