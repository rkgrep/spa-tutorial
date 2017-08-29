import $ from 'jquery'
import { compile } from 'handlebars'
import template from '~html/about.handlebars'
import lorem from './md/lorem.md'
import ipsum from './md/ipsum.md'
import moment from 'moment'

import Remarkable from 'remarkable'
const md = new Remarkable()

export default () => {
    let user = 'Jonh'
    let contents = md.render(lorem) + md.render(ipsum)
    let now = moment().format('MMMM Do YYYY, h:mm:ss a')
    $('#app').html(compile(template)({
        user,
        contents,
        now,
    }))
}
