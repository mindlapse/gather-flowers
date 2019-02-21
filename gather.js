
const Flickr = require("flickr-sdk")
const api_key  = process.env.API_KEY
const start_ts = parseInt(process.env.START_TS) || 0
const download = require('download-file')

const MIN_DIM = 512
const MAX_DIM = 1024
const SLEEP_SECONDS = 3
const FOLDER = "/data/"
const flickr = new Flickr(api_key);


function sleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n*1000);
}


async function getPostedDate(photo) {
    let res = (await flickr.photos.getInfo({photo_id : photo.id, secret : photo.secret})).body
    return new Date(parseInt(res.photo.dateuploaded*1000))
}


(async () => {
    min_upload_date = new Date(start_ts)
    console.log(`Starting at timestamp ${start_ts}: ${min_upload_date}`)

    let page = -1
    let pages = 99999
    while (true) {
        try {
            console.log(`Searching ${min_upload_date}`)
            page += 1
            if (page >= pages) {
                break
            }

            // flower,flowers,lotus,water lily,daffodil,rose,gardenia,pansy
            let res = await flickr.photos.search({
                tags: 'rose,bokeh',
                tag_mode: 'all',
                per_page : 150,
                sort : 'date-posted-asc',
                page,
                min_upload_date
            })
            pages = res.body.photos.pages
            let photos = res.body.photos
            let numPhotos = photos.photo.length

            console.log(res.body)
            console.log(`Found ${numPhotos} photos on page ${page} of ${pages}`)

            if (numPhotos == 0) {
                console.log(res.body)
            }


            let advanced = false

            for (let p = 0; p < photos.photo.length; p++) {
                
                let photo = photos.photo[p]

                sleep(SLEEP_SECONDS)
                const postedDate = await getPostedDate(photo)
                if (postedDate.getTime() > min_upload_date.getTime()) {
                    min_upload_date = postedDate
                    advanced = true
                }
                console.log(postedDate + " postedTime: " + postedDate.getTime() + " min_upload_date: " + min_upload_date + " (" + min_upload_date.getTime() + ")")

                sleep(SLEEP_SECONDS)
                let sizes = (await flickr.photos.getSizes({photo_id : photo.id})).body.sizes
            
                if (sizes.candownload) {
                    for (let s = sizes.size.length - 1; s >= 0; s--) {
                        let size = sizes.size[s]
                        
                        if (size.width < MIN_DIM || size.height < MIN_DIM ||
                            (size.width >= MAX_DIM && size.height >= MAX_DIM)) {
                            continue
                        }
                
                        let filename = size.source.substring(size.source.lastIndexOf("/")+1)
                        let url = size.source
                        sleep(SLEEP_SECONDS)
                        download(url, { directory: FOLDER, filename:  filename }, function(err) {
                            if (err) throw err
                            console.log(`Downloaded ${filename}`)
                        })
                        break
                    }
                }
            }
            if (!advanced) {
                min_upload_date = new Date(min_upload_date.getTime() + 60*1000)
            }
        } catch (e) {
            console.log(e)
            min_upload_date = new Date(min_upload_date.getTime() + 60*1000)
            // Pass
        }
        sleep(SLEEP_SECONDS)
    }
})()
