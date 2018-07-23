import { handleDirectory } from '../files';


it('Should resolve the full filepath.', async () => {
    expect.assertions(1);
    const result = await handleDirectory('.');
    expect(result).toEqual('/Users/jacobchaffin/Developer/work/aws-demo');
});


it('Should create the directory', async() => {
  expect.assertions(1);
  const result = await handleDirectory('./local');
  expect(result).toEqual('/Users/jacobchaffin/Developer/work/aws-demo/local');
})


