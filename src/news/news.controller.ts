import { Controller, Injectable, Post, Body, Req, BadRequestException, HttpException, Get, Query, Param } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { NewsDto, savedNewsDTO } from './dto/news.dto';
import { NewsService } from './news.service';
import { Request } from 'express';
@Injectable()
@ApiTags('news')
@Controller('news')

export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    @ApiCreatedResponse({ description: "Latest News" })
    @ApiBody({ type: NewsDto })
    @Post('/fetchNews')
    async News(@Body() body: NewsDto) {
        console.log('API_CALL=>', {
            'request user id': '',
            'request body': body,
            api: `fetchNews`,
        });
        let country = Object.keys(body)[0]
        console.log('body', country)
        let resp = await this.newsService.fetchNews(country)
        // console.log('resp IN CONTROLLLER', resp.data.articles)
        return resp
    }

    @ApiCreatedResponse({ description: "Get Countries " })
    @ApiBody({ type: NewsDto })
    @Post('/country')
    async CData(@Body() body: NewsDto) {
        console.log('API_CALL=>', {
            'request user id': '',
            'request body': body,
            api: `country`,
        });
        const resp = await this.newsService.CData()
        // console.log('resp IN CONTROLLLER', resp.data.articles)
        return resp
    }


    @ApiCreatedResponse({ description: "Saving News Articles" })
    @ApiBody({ type: savedNewsDTO })
    @Post('/savedNews')
    async SavedNews(@Req() request: Request, @Body() body: savedNewsDTO) {
        console.log('API_CALL=>', {
            'request user id': '',
            'request body': body,
            api: `savedNews`,
        });
        try {
            console.log('body', body)
            const resp = await this.newsService.saveNews(body)
            console.log('resp', resp)
            return resp
        }
        catch (error) {
            console.log('error in catch controller', error.message)
            throw new HttpException("message", 400, { cause: new Error(error.message) })
            throw new BadRequestException(error)
        }
    }

    @ApiCreatedResponse({ description: "Fetching Saved News Articles" })
    // @ApiBody({ type: savedNewsDTO })
    @Get('/fetchSavedNews/:email?')
    async fetchSavedNews(@Param('email') email: string) {
        console.log('API_CALL=>', {
            'request user id': '',
            'request body': email,
            api: `fetchSavedNews`,
        });
        try {
            console.log('body', email)
            const res = await this.newsService.FetchSaved(email)
            // console.log('res', res)
            return res
        }
        catch (error) {
            throw new HttpException("message", 400, { cause: new Error(error.message) })
        }
    }

    @ApiCreatedResponse({ description: "Deleting Saved News Articles" })
    // @ApiBody({ type: savedNewsDTO })
    @Post('/DeleteSavedNews/:email?')
    async DeleteSavedNews(@Param('email') email: string) {
        console.log('API_CALL=>', {
            'request user id': '',
            'request body': email,
            api: `DeleteSavedNews`,
        });
        try {
            console.log('body', email)
            const res = await this.newsService.DeleteSaved(email)
            console.log('res', res)
            return res
        }
        catch (error) {
            throw new HttpException("message", 400, { cause: new Error(error.message) })
        }
    }

    @ApiCreatedResponse({ description: "Latest News" })
    @ApiBody({ type: NewsDto })
    @Post('/categoryNews')
    async Category(@Body() body: NewsDto) {
        console.log('API_CALL=>', {
            'request user id': '',
            'request body': body,
            api: `categoryNews`,
        });
        let category = Object.keys(body)[0]
        console.log('body', category)
        let resp = await this.newsService.Category(category)
        return resp.articles
    }

}