import $ from 'jquery'
import { compile } from 'handlebars'
import template from './html/home.handlebars'
import moment from 'moment'
import _ from 'lodash'

export default () => {
    let user = 'Jonh'
    let now = _.toUpper(moment().format('MMMM Do YYYY, h:mm:ss a'))
    $('#app').html(compile(template)({
        user,
        now,
    }))
}
