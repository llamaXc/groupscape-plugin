export function formatToRuneScapeGp(value){
    if(value < 10000){
        return value.toLocaleString() + "gp"
    }else if(value < 100000){
        return value.toLocaleString() + "gp"
    }else if(value < 1000000){
        return value / 1000 + "K";
    }else if(value < 10000000){
        return value / 1000 + "K"
    }else if(value >= 10000000){
        return Math.floor(value / 1000000) + "M"
    }
    return 0;
}

