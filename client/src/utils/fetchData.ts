export const exerciseOptions: RequestInit = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'a134c4486fmshaf1c22c1e5252dbp12837djsn00b1f42358e8',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    },
};

export const youtubeOptions: RequestInit = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'a134c4486fmshaf1c22c1e5252dbp12837djsn00b1f42358e8',
        'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
    },
};

// Generic fetchData function with a return type
export const fetchData = async <T = any>(url: string, options: RequestInit): Promise<T> => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: T = await response.json();
    return data;
};
