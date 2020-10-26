
// init
const myLinks = [{ "name": "HerbMates app", "url": "https://github.com/cdelieto1/herbmates_flask" }, { "name": "Reddit", "url": "https://www.reddit.com/r/explainlikeimfive/" }, { "name": "CloudFlare Workers", "url": "https://developers.cloudflare.com/workers/" }
]
const mySocialLinks = [{ "image": "https://simpleicons.org/icons/facebook.svg", "url": "https://facebook.com" }, { "image": "https://simpleicons.org/icons/linkedin.svg", "url": "https://linkedin.com" }, { "image": "https://simpleicons.org/icons/twitter.svg", "url": "https://twitter.com" }
]
const myName = "Cassandra Delieto"
const mySocialName = "Cassie"

const externalUrl = "https://static-links-page.signalnerve.workers.dev"
const externalAvatarUrl = "https://content.internetvideoarchive.com/content/hdphotos/12982/012982/012982_682x511_637333931678824393.jpg"


//fetches the request from ALL!!! 127.0.0.1:8787 local host inbound
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {

  pathLength = request.url.split("/").length
  if (request.method == 'GET' && request.url.includes("/links") && ( pathLength <= 5 )) {
    // create json response API endpoint
    return getLinks(request)
  } else {
    // create catchall response (html)
    const response = await fetch(externalUrl) //fetch to external $URL
    return new HTMLRewriter().on("div", new ElementHandler())
                             .on("img", new ElementHandler())
                             .on("h1", new ElementHandler())
                             .on("body", new ElementHandler()) // extra credit: look for body
                             .on("title", new ElementHandler()) // extra credit: look for title in head
                             .transform(response)
  }
}


function getLinks(request) {
    const init = {
        headers: { "content-type": "application/json" },
    }

    const body = JSON.stringify(myLinks)
    return new Response(body, init)
}


class ElementHandler {
  element(element) {
    // An incoming element, such as `div` or `img` etc.
    //console.log(`Incoming element: ${element.tagName}`)
    const elementTagName = element.tagName
    const elementId = element.getAttribute("id")

    // consolidated in one block because exercise calls for #ID checks
    // and can re-use code for that
    if (elementId == "links") {
        // append the mylinks array here
        for (let i = 0; i < myLinks.length; i++) {
            element.append(" <a href='" + myLinks[i].url + "'>"+ myLinks[i].name + "</a>", { html: true })
        }

    }  else if ( elementId == "profile") {
        element.removeAttribute("style") //removes entire style attribute containing display:none
    } else if ( elementId == "avatar") {
        element.setAttribute("src", externalAvatarUrl)
    } else if ( elementId == "name" ) {
        element.append(mySocialName, {html: true})
    } 


    // EXTRA CREDIT
    else if ( elementId == "social") {
        element.removeAttribute("style")
        // append the mylinks array here
        for (let i = 0; i < mySocialLinks.length; i++) {
            element.append(" <a href='" + mySocialLinks[i].url + "'><img src=\""+ mySocialLinks[i].image + "\"/></a>", { html: true })
        }
    }

    // BODY: look for main element with matching class and update
    if ( elementTagName == "body" && element.getAttribute("class") == "bg-gray-900" ) {
        element.setAttribute("class", "bg-gray-500")
    }

    // TITLE update
    if (elementTagName == "title") {
        element.setInnerContent(myName)
    }

  }

}