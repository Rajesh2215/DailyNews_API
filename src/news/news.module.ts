import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { NewsController } from "./news.controller";
import { NewsSchema, savedNewSchema } from "./news.interface";
import { NewsService } from "./news.service";
import { UtilsSchema } from "src/utils.interface";

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'news', schema: NewsSchema },
        { name: 'utils', schema: UtilsSchema },
        { name: 'savedNews', schema: savedNewSchema}])],
    controllers: [NewsController],
    providers: [NewsService]
})
export class NewsModule { }