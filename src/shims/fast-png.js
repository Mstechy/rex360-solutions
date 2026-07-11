export const decode = () => {
  throw new Error('PNG decoding is unavailable in this build.');
};

export const encode = decode;

export default { decode, encode };
