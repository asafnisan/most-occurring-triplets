const fs = require('fs');
const path = require('path');

function popularUserJourneyTriplets(log, opts) {
    // generateUserJourneys generates an object that has the following format
    // { 
    //   user_1: ["/page_1", "page_2", "page_3", ...page_n],
    //   user_2: ["/page_1", "page_2", "page_3", ...page_n],
    //   .
    //   .
    //   .
    //   user_n: [...pages]
    // }
    function generateUserJourneys(logs) {
        let userJourneysMap = {}
        for ( let i = 0; i < logs.length ; i++ ) {
            pageView = logs[i]
            page = pageView[0]
            user = pageView[1]
            if (!userJourneysMap[user]) {
                userJourneysMap[user] = [page]
            } else {
                userJourneysMap[user].push(page)
            }
        }
        return userJourneysMap
    }

    // generateTriplets generates an object that has the following format
    // { 
    //   /path_1./path_2./path_3: count,
    //   /path_2./path_3./path_4: count,
    //   .
    //   .
    //   .
    //   /path_j./path_k./path_l: count,
    // }    
    function generateTriplets(journeys) {
        let tripletsCountMap = {}
        for (user in journeys) {
            for ( let i = 0; i <= journeys[user].length - 3; i++) {
                let triplet = [journeys[user][i], journeys[user][i + 1], journeys[user][i + 2]].join('.')
                if (!tripletsCountMap[triplet]) {
                    tripletsCountMap[triplet] = 1
                } else {
                    tripletsCountMap[triplet] = tripletsCountMap[triplet] + 1  
                } 
            }
        }
        return tripletsCountMap
    }
    
    // normalizedTripletsArray 
    function normalizedTripletsArray(triplets, opts) {
        let journeyTripletsMapped = Object.entries(triplets)
            .map((j) => { return { paths: j[0].split('.'), count: j[1] } })
            .sort((a, b) => { return b.count - a.count })

        journeyTripletsMapped.splice(opts.limit)
    
        journeyTripletsMapped.forEach((j) => {
            console.log(j.paths, "// cnt", j.count)
        })

        return journeyTripletsMapped.map((j) => (j.paths))
    }

    let userJourneys = generateUserJourneys(log)

    let journeyTriplets = generateTriplets(userJourneys)

    return normalizedTripletsArray(journeyTriplets, opts)
}

const args = process.argv
const fileName = args[2]
const limit = args[3]

let rawdata = fs.readFileSync(path.resolve(__dirname, fileName));
let logFile = JSON.parse(rawdata);

popularUserJourneyTriplets(logFile, { limit: limit })
