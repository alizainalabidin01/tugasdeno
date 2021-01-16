import {Application, send} from 'https://deno.land/x/oak/mod.ts'; 
import router from './rute.ts';
import userMidleware from './userMidleware.ts'


const app = new Application();
app.use(userMidleware);

app.use (router.routes());
app.use (router.allowedMethods());

app.use(async (context) => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}`
    });
  });

console.log("oke1");
await app.listen({port : 3000});

