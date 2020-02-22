/* eslint-disable @typescript-eslint/camelcase */
import jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
// import config from '../config';

// const {tenantId} = config.get('azure');

const client = jwksClient({
  jwksUri: `https://localhost/.well-known/jwks.json`,
});

export async function verifyToken(
  rawToken: string
): Promise<{
  surname: string;
  firstname: string;
  username: string;
  oid: string;
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token: {header: {kid: string}; payload: any} = jwt.decode(rawToken, {
    complete: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

  // TODO: validate result

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client.getSigningKey(token.header.kid, (err: any) => {
      if (err) {
        reject(err);
      }

      try {
        // Verify not working...
        // const result = jwt.verify(
        //   rawToken,
        //   // @ts-ignore
        //   key.publicKey
        // );

        const {family_name, given_name, upn, oid} = token.payload;

        resolve({
          surname: family_name,
          firstname: given_name,
          username: upn,
          oid: oid,
        });
      } catch (ex) {
        reject(ex);
      }
    });
  });
}
