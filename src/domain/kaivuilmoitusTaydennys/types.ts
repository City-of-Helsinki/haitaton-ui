import { KaivuilmoitusFormValues } from '../kaivuilmoitus/types';

export interface KaivuilmoitusTaydennysFormValues
  extends Omit<
    KaivuilmoitusFormValues,
    | 'id'
    | 'alluid'
    | 'alluStatus'
    | 'applicationType'
    | 'applicationIdentifier'
    | 'hankeTunnus'
    | 'valmistumisilmoitukset'
    | 'taydennyspyynto'
    | 'taydennys'
  > {
  id: string;
  muutokset: string[];
}
