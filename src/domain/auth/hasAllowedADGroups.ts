/**
 * Checks if the user belongs to any of the allowed Active Directory (AD) groups.
 *
 * @param {string[]} ad_groups - An array of AD group names the user belongs to.
 * @returns {boolean} - Returns `true` if the user belongs to at least one of the allowed AD groups, otherwise `false`.
 */
export default function hasAllowedADGroups(ad_groups: string[]): boolean {
  const ALLOWED_AD_GROUPS = window._env_?.REACT_APP_ALLOWED_AD_GROUPS?.split(';') ?? [];
  return ad_groups.some((group) => ALLOWED_AD_GROUPS.includes(group));
}
