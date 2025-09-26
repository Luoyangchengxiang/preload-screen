const versionMap = {
  x: 'major',
  y: 'minor',
  z: 'patch',
};
export default function uploadVersionType(params) {
  return versionMap[params] ?? versionMap.z;
}
