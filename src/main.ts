import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const allowedOrigins = process.env.ALLOWED_ORIGINS
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:(origin,callback)=>{
      console.log("Access request : ",origin)
      if(!origin){
        console.log("Denied !")
        return callback(null,true)
      }
      if(allowedOrigins?.includes(origin)){
        console.log("Allowed !")
        return callback(null,true)
      }
      callback(new Error("Not allowed by CORS !"))
    },
    credentials:true,
    methods:"GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders:'Content-Type,Authorization'

  })

  const config = new DocumentBuilder()
    .setTitle('Products-Visualization API')
    .setDescription('Products-Visualization API description')
    .setVersion('1.0')
    .addTag('Products-Visualization')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3001);
}
bootstrap();
