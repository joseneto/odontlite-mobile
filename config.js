export const apiUrl = () => {
    
    if(process.env.NODE_ENV === 'production'){
        return "https://us-central1-odontlite.cloudfunctions.net/api";
    }else{
        return "http://127.0.0.1:5001/odontlite/us-central1/api";
    }
}



