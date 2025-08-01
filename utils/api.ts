
// @ts-expect-error Database returns null but component expects undefined
const createURL = (path) => {
    return window.location.origin + path
}

// @ts-expect-error Database returns null but component expects undefined
export const updateEntry = async (id, logData, logType) => {
    console.log('Updating entry ID:', id);
    console.log('Sending data:', logData);
    console.log('Log type:', logType);
    
    // Map log types to their respective API endpoints
    const routeMap = {
        'transportation': `/api/activitylog/${id}`,
        'energy': `/api/energylog/${id}`,
        'food': `/api/foodlog/${id}`,
        'shopping': `/api/shoppinglog/${id}`
    };
// @ts-expect-error Database returns null but component expects undefined
    const endpoint = routeMap[logType];
    
    if (!endpoint) {
        throw new Error(`Invalid log type: ${logType}`);
    }

    const res = await fetch(new Request(createURL(endpoint), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logData }),
    }));

    if (res.ok) {
        const data = await res.json();


        return data.data;
    } else {
        throw new Error(`Failed to update ${logType} entry`);
    }
}

// @ts-expect-error Database returns null but component expects undefined
export const createNewEntry = async (entryData, logType) => {
    console.log('Sending data:', entryData); // Debug log
    console.log('Log type:', logType);
    // Map log types to their respective API endpoints
    const routeMap = {
        'transportation': '/api/activitylog',
        'energy': '/api/energylog',
        'food': '/api/foodlog',
        'shopping': '/api/shoppinglog'
    };
// @ts-expect-error Database returns null but component expects undefined
    const endpoint = routeMap[logType];
    
    if (!endpoint) {
        throw new Error(`Invalid log type: ${logType}`);
    }

    const res = await fetch(new Request(createURL(endpoint), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryData }),
    }));

    if (res.ok) {
        const data = await res.json();

        localStorage.setItem('formSubmitted', 'true');
        
        return data.data;
    } else {
        throw new Error(`Failed to create ${logType} entry`);
    }
}



// @ts-expect-error Database returns null but component expects undefined
export const deleteEntry = async (id, logData, logType) => {
    console.log('Updating entry ID:', id);
    console.log('Sending data:', logData);
    console.log('Log type:', logType);
    
    // Map log types to their respective API endpoints
    const routeMap = {
        'transportation': `/api/activitylog/${id}`,
        'energy': `/api/energylog/${id}`,
        'food': `/api/foodlog/${id}`,
        'shopping': `/api/shoppinglog/${id}`
    };
// @ts-expect-error Database returns null but component expects undefined
    const endpoint = routeMap[logType];
    
    if (!endpoint) {
        throw new Error(`Invalid log type: ${logType}`);
    }

    const res = await fetch(new Request(createURL(endpoint), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    
    }));

    if (res.ok) {
        const data = await res.json();


        return data.data;
    } else {
        throw new Error(`Failed to update ${logType} entry`);
    }
}

