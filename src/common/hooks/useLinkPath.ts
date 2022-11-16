import { $enum } from 'ts-enum-util';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../types/route';
import { getRouteLocalization } from './useLocalizedRoutes';

type RouteParams = Record<string, string>;

// It would be nice to type RouteParams depending by route argument
const useLinkPath = (route: ROUTES): ((routeParams: RouteParams) => string) => {
  const useTranslationResponse = useTranslation();
  const path = getRouteLocalization({
    useTranslationResponse,
    route,
    name: 'path',
  });
  const defaultReturnFunc = () => () => path;

  function hankeTunnusReturnFunc() {
    return function replaceParam({ hankeTunnus }: RouteParams) {
      return path.replace(':hankeTunnus', hankeTunnus);
    };
  }

  // https://github.com/UselessPickles/ts-enum-util/blob/master/docs/EnumValueVisitor.md#basic-usage-examples
  return $enum.visitValue(route).with({
    [ROUTES.HOME]: defaultReturnFunc,
    [ROUTES.HANKEPORTFOLIO]: defaultReturnFunc,
    [ROUTES.NEW_HANKE]: defaultReturnFunc,
    [ROUTES.EDIT_HANKE]: hankeTunnusReturnFunc,
    [ROUTES.PUBLIC_HANKKEET]: defaultReturnFunc,
    [ROUTES.PUBLIC_HANKKEET_MAP]: defaultReturnFunc,
    [ROUTES.PUBLIC_HANKKEET_LIST]: defaultReturnFunc,
    [ROUTES.FULL_PAGE_MAP]: hankeTunnusReturnFunc,
    [ROUTES.HAKEMUS]: defaultReturnFunc,
    [ROUTES.JOHTOSELVITYSHAKEMUS]: defaultReturnFunc,
    [ROUTES.HAITATON_INFO]: defaultReturnFunc,
    [ROUTES.ACCESSIBILITY]: defaultReturnFunc,
    [ROUTES.PRIVACY_POLICY]: defaultReturnFunc,
    [ROUTES.REFERENCES]: defaultReturnFunc,
  });
};

export default useLinkPath;
