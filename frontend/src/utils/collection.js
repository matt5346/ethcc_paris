export const CollectionType = {
    CHARACTERS: 'characters',
    THINGS: 'things',
    COLORS: 'colors',
    ACHIEVEMENTS: 'achievements',
    NONE: 'none',

    // only for interact with contract
    enum: {
        COLORS: 0,
        THINGS: 1,
        CHARACTERS: 2,
        ACHIEVEMENTS: 3,
        NONE: 4
    },
    getTypeByEnumNumber(number){
        const findType = Object.entries(this.enum).find((_, n) => n === number)
        if(!findType) return this.NONE
        return this[findType[0]]
    },

    getTypeByPageName(name) {
        return Object.keys(this).includes(name.toUpperCase()) && this[name.toUpperCase()] || 'characters';
    }
}