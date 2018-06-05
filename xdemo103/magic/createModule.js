import getRandom from './getRandom';

export default function createModule(name) {
  return {
    name,
    id: `${name}-${getRandom(10000)}`,
  };
}
