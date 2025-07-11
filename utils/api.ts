

const createURL = (path) => {
    return window.location.origin + path
}


export const updateEntry = async (id, logData) => {
    const res = await fetch(new Request(createURL(`/api/activitylog/${id}`), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logData }),
    }));

    if (res.ok) {
        const data = await res.json();
        return data.data;
    }
}


// export const createNewEntry = async (entrydata) => {
//     const res = await fetch(new Request(createURL('/api/activitylog'), {
//         method: 'POST',
        
//     })
// )

//     if (res.ok) {
//         const data = await res.json()
//         return data.data
//     }
// }

export const createNewEntry = async (entryData) => {
    const res = await fetch(new Request(createURL('/api/activitylog'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryData }),
    })
);

    if (res.ok) {
        const data = await res.json();
        return data.data;
    }
}