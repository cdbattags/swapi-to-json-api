const _ = require('lodash')

const convert = (body, type, id) => {
    const data = {
        type: type,
        id: id,
        attributes: {},
        relationships: {},
        links: {
            self: body.url
        }
    }

    const included = []

    _.each(body, (value, key) => {
        if (
            (
                (
                    typeof value === 'string' &&
                    value.includes('swapi.co')
                ) ||
                (
                    Array.isArray(value) &&
                    typeof value[0] === 'string' &&
                    value[0].includes('swapi.co')
                )
            ) &&
            !(key === 'url')
        ) {

            const temp = {
                links: {
                    self: 'N/A',
                },
                data: null
            }

            if (Array.isArray(value)) {
                temp.data = []

                let type = '' // a little messy because gets last type in list

                _.each(value, (relatedUrl) => {
                    const splitUrl = new URL(relatedUrl).pathname.split('/')
                    const id = splitUrl[splitUrl.length - 2]
                    type = splitUrl[splitUrl.length - 3]

                    temp.data.push({
                        type: type,
                        id: id
                    })

                    data.relationships[type] = temp

                })

                included.push({
                    [type]: value
                })

            } else {

                const splitUrl = new URL(value).pathname.split('/')
                const id = splitUrl[splitUrl.length - 2]
                const type = splitUrl[splitUrl.length - 3]

                temp.data = {
                    type: type,
                    id: id
                }

                data.relationships[type] = temp
                included.push({
                    [type]: value
                })

            }

        } else {
            if (!(Array.isArray(value) && value.length === 0)) {
                data.attributes[key] = value
            }
        }
    })

    return({data: data, included: included})
}

const convertOne = (body) => {

    const splitUrl = new URL(body.url).pathname.split('/')
    const id = splitUrl[splitUrl.length - 2]
    const type = splitUrl[splitUrl.length - 3]

    const converted = convert(body, type, id)

    const jsonApiFormat = {
        links: [],
        ...converted
    }

    return jsonApiFormat

}

const convertSome = (bodies) => {

    const temp = []

    _.each(bodies, (body) => {
        const splitUrl = new URL(body.url).pathname.split('/')
        const id = splitUrl[splitUrl.length - 2]
        const type = splitUrl[splitUrl.length - 3]

        temp.push(convert(body, type, id).data)
    })

    return({
        links: [],
        data: temp
    })
}

module.exports = {
    convertOne: convertOne,
    convertSome: convertSome
}