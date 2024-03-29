import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { newsDoc, savedNews, savedNewsDoc } from './news.interface';
// import NewsApi from 'newsapi'
// import { Article } from 'newsapi'
import axios from 'axios'
import { utils, utilsDoc } from 'src/utils.interface';
import { HttpStatus } from '@nestjs/common/enums';
@Injectable()
export class NewsService {
  constructor(@InjectModel('news') private readonly newsModel: Model<newsDoc>,
    @InjectModel('utils') private readonly utilModel: Model<utilsDoc>,
    @InjectModel('savedNews') private readonly savedNewsModel: Model<savedNewsDoc>,) { }

  // private readonly news=new  NewsApi('6a10571f1f324435a5e5d891c5bd382b');

  async CData(){
    const value = await this.utilModel.find({})
    const country =  value[0]['country'][0]
    console.log('country', country)
    // country.map((e)=>{
    //   console.log('first', e[0])
    // })
    // console.log('Total Countries', country)
    return country
  }


  async saveNews(body){
    try{
      console.log('body in newsService', body)
      const resp = await this.savedNewsModel.find({userEmail:body.userEmail,title:body.title})
      console.log('resp', resp)
      console.log('resp', resp.length)
      let data;
      if(resp.length>0){
         data = await this.savedNewsModel.deleteOne({userEmail:body.userEmail,title:body.title})
        console.log('data for deleting', data)
      }
      else{
       data = await  this.savedNewsModel.create({...body})
      console.log('data for creating', data)
      }
      console.log('data final', data)
      return {success:true}
    }catch(error){
      console.log('error in newsService', error.message)
      throw new BadRequestException(error.message)
    }
  }
  async fetchNews(country) {
    try {
      console.log('fetching nes', country)
      const cn = await this.utilModel.find({})
      const countryCode =  cn[0]['country'][0][country]
      console.log('cn',countryCode)
      const api=`https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${process.env.APIKEY}`
      const fetch = await axios.get(api)
      // console.log('fetch', fetch.data)
      return fetch.data
      // const fetch = {
      //   "status": "ok",
      //   "totalResults": 11,
      //   "articles": [
      //     {
      //       "source": {
      //         "id": "the-times-of-india",
      //         "name": "The Times of India"
      //       },
      //       "author": "Bloomberg",
      //       "title": "Onion shortage threatens a new chapter in world food crisis - Economic Times",
      //       "description": "The costs of wheat and grains have fallen in recent months, easing concern over access to some staples. But a combination of factors is now shaking up the vegetable market, the backbone of a healthy, sustainable diet. And at the sharp end of that is the humbl…",
      //       "url": "https://economictimes.indiatimes.com/news/economy/indicators/onion-shortage-threatens-a-new-chapter-in-world-food-crisis/articleshow/98196625.cms",
      //       "urlToImage": "https://img.etimg.com/thumb/msid-98196784,width-1070,height-580,imgsize-148800,overlay-economictimes/photo.jpg",
      //       "publishedAt": "2023-02-24T04:21:00Z",
      //       "content": "Lalaine Basa would buy a kilo of onions to make spring rolls at her catering business north of Manila. Shes now changed her recipe to use half the amount because of soaring prices in the Philippines.… [+6370 chars]"
      //     },
      //     {
      //       "source": {
      //         "id": null,
      //         "name": "Livemint"
      //       },
      //       "author": "Livemint",
      //       "title": "Hindenburg rout: LIC's ₹30,000 crore investment in Adani stocks in a loss | Mint - Mint",
      //       "description": "LIC on January 30 had said that the total purchase value of equity under all Adani group companies was at  ₹30,127 crore",
      //       "url": "https://www.livemint.com/market/stock-market-news/gautam-adani-hindenburg-row-how-much-lic-has-lost-in-investments-market-value-in-adani-group-stocks-11677208773690.html",
      //       "urlToImage": "https://images.livemint.com/img/2023/02/24/600x338/LIC_adani_1677209001681_1677209001875_1677209001875.JPG",
      //       "publishedAt": "2023-02-24T04:11:12Z",
      //       "content": "Led by the heavy sell-off in Adani Group stocks, state-run insurance giant Life Insurance Corporation of India's (LIC) investments made in the group companies have turned negative as its investment v… [+2111 chars]"
      //     },
      //     {
      //       "source": {
      //         "id": null,
      //         "name": "OpIndia"
      //       },
      //       "author": "OpIndia Staff",
      //       "title": "As Punjab police decide to free Khalistani aide after Amritpal Singh’s threat and street veto, CM Bhagwant Mann says law and order is under control: Details - OpIndia",
      //       "description": "Speaking at the fifth Progressive Punjab Investors Summit, CM Bhagwant Mann claimed that the state of Punjab has the right environment and peaceful atmosphere to set up factories and plants here. | OpIndia News",
      //       "url": "https://www.opindia.com/2023/02/khalistani-aide-walk-free-amritpal-singhs-threat-cm-bhagwant-mann-law-and-order-under-control/",
      //       "urlToImage": "https://www.opindia.com/wp-content/uploads/2023/02/grqnno6j0cmhcejn_1669448124.jpg",
      //       "publishedAt": "2023-02-24T04:10:39Z",
      //       "content": "After violence led by supporters of pro-Khalistan leader Amritpal Singh in Ajnala, where they were seen brandishing swords, the Punjab Police was quick to surrender as it decided to take back the FIR… [+3360 chars]"
      //     },
      //     {
      //       "source": {
      //         "id": null,
      //         "name": "News18"
      //       },
      //       "author": "Buzz Staff",
      //       "title": "Moon, Jupiter and Venus Come Together in Night Sky as Twitter Users Snap Photos of Rare Event - News18",
      //       "description": "Moon, Jupiter and Venus decorated Twitter with dazzling images of the conjunction that took place on Wednesday. This planetary meet-up was joined by the Moon in the night skies.",
      //       "url": "https://www.news18.com/buzz/moon-jupiter-and-venus-come-together-in-night-sky-as-twitter-users-snap-photos-of-rare-event-7154713.html",
      //       "urlToImage": "https://images.news18.com/ibnlive/uploads/2023/02/untitled-2023-02-24t093727.747-167721167116x9.jpg",
      //       "publishedAt": "2023-02-24T04:08:20Z",
      //       "content": "In a rare celestial event, the Moon, Jupiter, and Venus came together to set a spectacular night-time show across the world. The trio aligned to form a perfect trifecta on Wednesday, giving stargazer… [+1654 chars]"
      //     },
      //     {
      //       "source": {
      //         "id": null,
      //         "name": "Koimoi"
      //       },
      //       "author": "Shalmesh More",
      //       "title": "Selfiee Box Office Advance Booking Day 1: Akshay Kumar & Emraan Hashmi Starrer Fails To Hit 1 Crore Mark, Now Everything Depends On Walk-In Audience - Koimoi",
      //       "description": "Akshay Kumar & Emraan Hashmi's Selfiee has even failed to create a base for itself on its day 1 at the box office. Read to know more!",
      //       "url": "https://www.koimoi.com/?p=964549",
      //       "urlToImage": "https://static-koimoi.akamaized.net/wp-content/new-galleries/2023/02/selfiee-box-office-advance-booking-day-1-001.jpg",
      //       "publishedAt": "2023-02-24T04:04:35Z",
      //       "content": "Selfiee Box Office Advance Booking Day 1(Photo Credit Still From Selfiee)\r\nSelfiee starring Akshay Kumar and Emraan Hashmi is finally out in theatres and now all eyes are set on how it fares at the b… [+1752 chars]"
      //     },
      //     {
      //       "source": {
      //         "id": null,
      //         "name": "Livemint"
      //       },
      //       "author": "Livemint",
      //       "title": "DLF to prepay 5,000 NCDs worth ₹500 cr: Check details here | Mint - Mint",
      //       "description": "It allotted 5,000 senior, secured, rated, listed, redeemable, rupee denominated non-convertible debentures (NCDs) of the face value of  ₹10,00,000 each in March 2021",
      //       "url": "https://www.livemint.com/companies/news/dlf-to-prepay-5-000-ncds-worth-rs-500-cr-check-details-here-11677209364988.html",
      //       "urlToImage": "https://images.livemint.com/img/2023/02/24/600x338/DLF_1568610593469_1677210939578_1677210939578.jpg",
      //       "publishedAt": "2023-02-24T03:57:16Z",
      //       "content": "Real estate developer, DLF on Thursday said that the company has exercised the option to prepay the non-convertible debentures (NCDs) worth 500 crores, according to its regulatory filing.DLF had allo… [+1481 chars]"
      //     },
      //     {
      //       "source": {
      //         "id": null,
      //         "name": "Barca Blaugranes"
      //       },
      //       "author": "Gill Clark",
      //       "title": "Kounde says Barcelona will learn from ‘very painful’ Manchester United defeat - Barca Blaugranes",
      //       "description": "The Catalans are OUT of Europe",
      //       "url": "https://www.barcablaugranes.com/2023/2/24/23612605/kounde-says-barcelona-will-learn-from-very-painful-manchester-united-defeat",
      //       "urlToImage": "https://cdn.vox-cdn.com/thumbor/DxhXXistaRhF1KPGi8FRmdH76do=/0x0:4282x2242/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/24456230/1247418383.jpg",
      //       "publishedAt": "2023-02-24T02:00:00Z",
      //       "content": "Jules Kounde admits that Barcelonas defeat to Manchester United in the Europa League is very painful but should act as a learning process for the players.\r\nBarcelona were beaten 2-1 at Old Trafford i… [+1291 chars]"
      //     },
      //     {
      //       "source": {
      //         "id": "the-times-of-india",
      //         "name": "The Times of India"
      //       },
      //       "author": "Sagar Malviya",
      //       "title": "Shoppers' grocery purchases return to growth aisle after five quarters of fall - Economic Times",
      //       "description": "The pace is lower than in the December quarter of 2020 when urban volumes rose 4.4% and rural expanded 6.6%, indicating only a partial revival.  We are seeing early signs of recovery in rural markets,  said Neeraj Khatri, chief executive, Wipro Consumer Care,…",
      //       "url": "https://economictimes.indiatimes.com/industry/cons-products/fmcg/shoppers-grocery-purchases-return-to-growth-aisle-after-five-quarters-of-fall/articleshow/98193029.cms",
      //       "urlToImage": "https://img.etimg.com/thumb/msid-98193052,width-1070,height-580,imgsize-210376,overlay-economictimes/photo.jpg",
      //       "publishedAt": "2023-02-24T00:20:00Z",
      //       "content": "Purchases of daily groceries and essentials rose 2.4% in the October-December period, halting a five-quarter run of declines in the fast-moving consumer goods (FMCG) segment. The quantity of FMCG goo… [+2489 chars]"
      //     },
      //     {
      //       "source": {
      //         "id": null,
      //         "name": "India Today"
      //       },
      //       "author": "Reuters",
      //       "title": "One year into Ukraine war, China says sending weapons will not bring peace - India Today",
      //       "description": "China's deputy UN Ambassador Dai Bing told the UN General Assembly that \"brutal facts\" offer ample proof that sending weapons will not bring peace in Ukraine.",
      //       "url": "https://www.indiatoday.in/world/russia-ukraine-war/story/one-year-into-ukraine-war-china-says-sending-weapons-will-not-bring-peace-2338836-2023-02-24",
      //       "urlToImage": "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202302/collage_maker-24-feb-2023-02.19-am-sixteen_nine.jpg?VersionId=BS8Kfa8aXODQXmkYIB3SJ2xKwrbZxKpg",
      //       "publishedAt": "2023-02-23T20:54:14Z",
      //       "content": "By Reuters: China told the United Nations on Thursday that one year into the Ukraine war \"brutal facts offer an ample proof that sending weapons will not bring peace,\" just days after the United Stat… [+2087 chars]"
      //     },
      //     {
      //       "source": {
      //         "id": null,
      //         "name": "The Tribune India"
      //       },
      //       "author": "The Tribune India",
      //       "title": "Silky Skin Skin Tag Remover Reviews: Scam or Legit Mole & Skin Tag Corrector Serum? - The Tribune India",
      //       "description": "We often consider skin tags and moles harmless, especially when minor and not bothersome. However, these growths can sometimes be indicative of more serious underlying issues. There are a variety of skincare serums available that can diminish the appearance o…",
      //       "url": "https://www.tribuneindia.com/news/brand-connect/silky-skin-skin-tag-remover-reviews-scam-or-legit-mole-skin-tag-corrector-serum-482489",
      //       "urlToImage": "https://englishtribuneimages.blob.core.windows.net/gallary-content/2023/2/2023_2$largeimg_1494173541.jpg",
      //       "publishedAt": "2023-02-23T15:08:00Z",
      //       "content": "We often consider skin tags and moles harmless, especially when minor and not bothersome. However, these growths can sometimes be indicative of more serious underlying issues. There are a variety of … [+6666 chars]"
      //     },
      //     {
      //       "source": {
      //         "id": null,
      //         "name": "Livelaw.in"
      //       },
      //       "author": "LIVELAW NEWS NETWORK",
      //       "title": "Uddhav Thackeray vs Eknath Shinde : Live Updates From Supreme Court Hearing In Shiv Sena case [Feb 23] - Live Law - Indian Legal News",
      //       "description": "A Constitution Bench of the Supreme Court will continue hearing today the cases related to Shiv Sena rift.Senior Advocate Kapil Sibal had been making arguments on behalf of Uddhav Thackeray for",
      //       "url": "https://www.livelaw.in/top-stories/uddhav-thackeray-vs-eknath-shinde-live-updates-from-supreme-court-hearing-in-shiv-sena-case-feb-23-222285",
      //       "urlToImage": "https://www.livelaw.in/h-upload/2023/02/23/460336-live-updates-uddhav-thackeray-vs-eknath-shinde.jpg",
      //       "publishedAt": "2023-02-23T09:30:03Z",
      //       "content": "A Constitution Bench of the Supreme Court will continue hearing today the cases related to Shiv Sena rift.Senior Advocate Kapil Sibal had been making arguments on behalf of Uddhav Thackeray for the p… [+290 chars]"
      //     }
      //   ]
      // }
      // console.log('fetch', fetch.data.articles)
      // const data = fetch.data.articles
      // await data.map(async (e)=>{
      //   try{
      //     console.log('finding')
      //     const news = await this.newsModel.find({ title:e.title})
      //     console.log('news', news)
      //     if(!news || []){
      //       console.log('Its not there')
      //       const res = await this.newsModel.insertMany(e)
      //     }
      //   }
      //   catch(error){
      //     console.log('errpr', error)
      //   }


      // })
      return fetch

      return fetch
    }
    catch (error) {
      console.log('error', error)
    }
  }

  async FetchSaved(body){
    console.log('body', body)
    try{
      const res = await this.savedNewsModel.find({userEmail:body})
      // console.log('res', res)
      return res
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async  DeleteSaved(email){
    try{
      const data = await this.savedNewsModel.deleteMany({userEmail:email})
      console.log('data', data)
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }
  
  async Category(category) {
    try {
      console.log('fetching nes', category)
      // const api=`https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${process.env.APIKEY}`
      const api=`https://newsapi.org/v2//top-headlines?category=${category}&country=in&apikey=${process.env.APIKEY}`
      const fetch = await axios.get(api)
      // console.log('fetch', fetch.data)
      return fetch.data
    }catch(error){
      console.log('error',error)
    }
    }
}