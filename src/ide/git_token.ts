import { jwtDecode } from "jwt-decode";

/**
 * 
 * @param token The encoded jwt git token
 * @returns Decoded JSON object
 */
export function decodeJWT(token: string): any {
    if(!validJWT(token)) throw "InvalidToken";
	return JSON.parse(JSON.stringify(jwtDecode(token)));;
}

/**
 * 
 * @returns Encoded jwt token from localStorage or empty string if no token found
 */
export function getRawToken(): string {
    try {
        const token = localStorage.getItem("git_token");
        if(validJWT(token)) {
            return String(token);
        } else {
            return "";
        }
    } catch(err) {
        return "";
    }
}

/**
 * 
 * @param token The encoded jwt git token
 * @returns true if the token is valid and not expired, else false
 */
export function validJWT(token: string | null): boolean {
    if(!token) return false;
    try {
        const jsonToken = JSON.parse(JSON.stringify(jwtDecode(token)));
        if(!jsonToken.exp) return false;
        if(jsonToken.exp < Math.floor(Date.now() / 1000)) return false;
        if(!jsonToken.iat) return false;
        if(!jsonToken.data.info.access_token) return false;
        return true;
    } catch(err) {
        return false;
    }
}