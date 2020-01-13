export function getToken(){
    if (localStorage.getItem('acc') !== null) {
        return localStorage.getItem('acc')
    }
    else{
        return null
    }
}
export function salir(){
    localStorage.clear();
    window.location.reload(true);
}
export function apiPath(){
    var path = "http://localhost:3001";
    return path;
}
