export default {
  name: 'store',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
};
