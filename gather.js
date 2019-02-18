
const Flickr = require("flickr-sdk")
const api_key  = process.env.API_KEY
const start_ts = parseInt(process.env.START_TS) || 0
const download = require('download-file')

const MIN_DIM = 1024
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

    while (true) {
        try {
            console.log(`Searching ${min_upload_date}`)
            let res = await flickr.photos.search({
                text: 'flower,flowers',
                per_page : 1000,
                sort : 'date-posted-asc',
                min_upload_date
            })
            let photos = res.body.photos
            let numPhotos = photos.photo.length

            console.log(`Found ${numPhotos} photos`)
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
                    let size = sizes.size[sizes.size.length - 1]
                    
                    if (size.width < MIN_DIM || size.height < MIN_DIM) {
                        continue
                    }
            
                    let filename = size.source.substring(size.source.lastIndexOf("/")+1)
                    let url = size.source
                    sleep(SLEEP_SECONDS)
                    download(url, { directory: FOLDER, filename:  filename }, function(err) {
                        if (err) throw err
                        console.log(`Downloaded ${filename}`)
                    }) 
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
