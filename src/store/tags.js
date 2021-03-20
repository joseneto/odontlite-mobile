import {createSlice, createSelector} from '@reduxjs/toolkit'
import {apiRequest} from './api';

const slice = createSlice({
    name: "tags",
    initialState:{ 
        list: []        
    },
    reducers: {

        tagAdded: (tags, action) => {
            tags.list.unshift(action.payload);
        },

        tagUpdated: (tags, action) => {
            const index = tags.list.findIndex(tag => tag.id === action.payload.id)
            for (let attr in action.payload) {
                tags.list[index][attr] = action.payload[attr];                     
            }               
        },

        tagDeleted: (tags, action) =>{     
            const index = tags.list.findIndex(tag => tag.id === action.payload.id)
            tags.list.splice(index, 1)     
           
        },

        tagsReceived: (tags, action) =>{            
            tags.list = action.payload;
        },

        tagsPaged: (tags, action) =>{            
            tags.list = tags.list.concat(action.payload);                 
        }
    }
});

const {
    tagAdded, 
    tagUpdated,
    tagsReceived,
    tagDeleted,
    tagsPaged
} = slice.actions;
export default slice.reducer;

//Create Action
export const addTag = (tag) => apiRequest({
    url: "tags",
    method: 'post',
    data: tag,
    onSuccess: tagAdded.type    
})


export const updateTag = (id, tag) => apiRequest({
    url: "tags/"+id,
    method: 'patch',
    data: tag,
    onSuccess: tagUpdated.type    
})

export const deleteTag = (id) => apiRequest({
    url: "tags/"+id,
    method: 'delete',
    onSuccess: tagDeleted.type    
})

export const getTags = (term, lastId) => (dispatch) => {

    return dispatch(apiRequest({
        url: `tags?term=${term || ''}&lastId=${lastId || ''}`,
        onSuccess: tagsReceived.type
        })
    );
}

export const addPageTags = (term, lastId) => (dispatch) => {

    return dispatch(apiRequest({
        url: `tags?term=${term || ''}&lastId=${lastId || ''}`,        
        onSuccess: tagsPaged.type,        
        })
    );
}

//Selector
export const getActiveTags = createSelector(
    state => state.entities.tags,
    tags => tags.list.filter(tag => !tag._deleted)
)  
