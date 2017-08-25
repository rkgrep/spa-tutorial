import $ from 'jquery'
import { compile } from 'handlebars'
import template from './html/about.handlebars'

export default () => {
    let user = 'Jonh'
    $('#app').html(compile(template)({
        user,
    }))
}
