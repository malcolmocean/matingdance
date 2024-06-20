function appendQueryStringToLinks(string) {
  const links = document.getElementsByTagName('a')
  for (let i = 0; i < links.length; i++) {
    const link = links[i]
    const href = link.getAttribute('href')
    if (href && !href.startsWith('#')) {
      link.setAttribute('href', href + (href.includes('?') ? '&' : '?') + string)
    }
  }
}

// 
function passthruQueryStringToLinks() {
  // Get the current page's query string
  const queryString = window.location.search
  appendQueryStringToLinks(queryString.replace(/^\?/, ''))
}

// turn eg ?tw=announceJuly into ?[utm_content=toplinks&]utm_source=twitter&utm_medium=social&utm_campaign=announceJuly
function appendUTMParamsToLinks() {
  // Get the current page's query string
  const queryString = window.location.search
  
  // Parse the query string to get the parameter values
  const params = new URLSearchParams(queryString)
  
  if (params.get('utm_source')) {
    return passthruQueryStringToLinks()
  }

  const twitter = params.get('tw')
  const facebook = params.get('fb')
  const youtube = params.get('yt')
  const mocom = params.get('mocom')

  // Determine the source and medium based on the platform
  let source = ''
  let medium = ''
  let campaign = ''

  if (twitter) {
    source = 'twitter'
    medium = 'social'
    campaign = twitter
  } else if (facebook) {
    source = 'facebook'
    medium = 'social'
    campaign = facebook
  } else if (youtube) {
    source = 'facebook'
    medium = 'social'
    campaign = youtube
  } else if (mocom) {
    source = 'facebook'
    medium = 'email'
    campaign = mocom
  } else if (queryString) {
    const firstEqualsIndex = queryString.indexOf('=')
    source = firstEqualsIndex !== -1 ? queryString.substring(0, firstEqualsIndex) : queryString
    medium = 'referral'
    campaign = firstEqualsIndex !== -1 ? queryString.substring(firstEqualsIndex+1) : queryString
  } else {
    return
  }

  // Construct the UTM parameters
  const utmParams = `utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`
  appendQueryStringToLinks(utmParams)
}


window.onload = () => appendUTMParamsToLinks()
