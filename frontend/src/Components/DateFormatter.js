import {parse,format} from 'date-fns'

export const dateFormat = (dateString) =>{
    const date = parse(dateString, 'M/d/yyyy, h:mm:ss a', new Date())

    return format(date, 'MMMM d yyyy - h:mm a');
};