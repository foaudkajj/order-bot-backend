import { Context, Scenes } from "telegraf";
import { WizardSession } from "./WizardSession";

/**
 * We can define our own context object.
 *
 * We now have to set the scene object under the `scene` property. As we extend
 * the scene session, we need to pass the type in as a type variable.
 *
 * We also have to set the wizard object under the `wizard` property.
 */
export interface BotContext extends Context {
    // will be available under `ctx.myContextProp`
    myContextProp: string

    // declare scene type
    scene: Scenes.SceneContextScene<BotContext, WizardSession>
    // declare wizard type
    wizard: Scenes.WizardContextWizard<BotContext>
}