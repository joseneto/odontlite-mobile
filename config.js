export const apiUrl = () => {
    return "https://us-central1-odontlite.cloudfunctions.net/api";
    if(process.env.NODE_ENV === 'production'){
        return "https://us-central1-odontlite.cloudfunctions.net/api";
    }else{
        return "http://192.168.15.8:5001/odontlite/us-central1/api";
    }
}



