const app = Vue.createApp({
    data() {
        console.log('Vue app data() running');
        const stored = JSON.parse(localStorage.getItem('gallery_data') || '{}');
        console.log('Loaded from storage:', stored);

        // helper to ensure every entry becomes an object with a `url` property
        const normalize = (arr = []) =>
            (arr || [])
                .map(i => {
                    if (!i) return null;
                    if (typeof i === 'string') return { url: i };
                    if (typeof i === 'object' && i.url) return i;
                    // if it's an object without url, ignore it
                    return null;
                })
                .filter(Boolean);

        return {
            ocArt: [
               { url: '/images/Cherry5.png' },
               { url: '/images/Cherry6.png' },
               { url: '/images/DND.png' },
               { url: '/images/city-me.png' },
               { url: '/images/Animation_Day_.png' }
            ].concat(normalize(stored.ocArt)),

            showOcArt: false,

            fanArt: [
               { url: '/images/Arcane Persona.png' },
               { url: '/images/tzekel-kan.png' }
            ].concat(normalize(stored.fanArt)),
            showFanArt: false,

            mlpArt: [
               { url: '/images/mlp1.png' },
               { url: '/images/mlp2.png' },
               { url: '/images/mlp3.png' }
            ].concat(normalize(stored.mlpArt)),
            showMlpArt: false,

            twilightSparkle: [
                { url: '/images/ts1.png' },
                { url: '/images/ts2.png' },
                { url: '/images/ts3.png' }
            ].concat(normalize(stored.twilightSparkle)),
            showTwilightSparkle: false,

            mlpPrincesses: [
                { url: '/images/princess1.png' },
                { url: '/images/princess2.png' },
                { url: '/images/princess3.png' },
                { url: '/images/princess4.png' }
            ].concat(normalize(stored.mlpPrincesses)),
            showMlpPrincesses: false,

            prideGallery: [
                { url: '/images/pride-me.png' },
                { url: '/images/Me - Genderfluid.png' },
                { url: '/images/Persona3.png' },
                { url: '/images/Persona4.png' },
                { url: '/images/Persona15.png' },
                { url: '/images/pan-me.png' }
            ].concat(normalize(stored.prideGallery)),
            showPrideArt: false
        }
    },

    methods: {
        myMethod(){},
        showOc(){ this.showOcArt = !this.showOcArt },
        showFan(){ this.showFanArt = !this.showFanArt },
        showMlp(){ this.showMlpArt = !this.showMlpArt },
        showMlpTS(){ this.showTwilightSparkle = !this.showTwilightSparkle },
        showMlpP(){ this.showMlpPrincesses = !this.showMlpPrincesses },
        showPride(){ this.showPrideArt = !this.showPrideArt },

        // changed code: Vue-handled insert (called by form @submit.prevent)
        async handleInsert() {
            const category = this.$refs.artCategory?.value;
            const file = this.$refs.artFile?.files?.[0];
            if (!category || !file) {
                alert('Select a category and file.');
                return;
            }

            // read file as data URL
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(file);
            }).catch(err => {
                console.error('FileReader failed', err);
                alert('Error reading file.');
            });
            if (!dataUrl) return;

            // update reactive array immediately
            if (!this[category]) this[category] = [];
            this[category].push({ url: dataUrl, created: Date.now(), fileName: file.name });

            // persist to localStorage
            const store = JSON.parse(localStorage.getItem('gallery_data') || '{}');
            store[category] = store[category] || [];
            store[category].push({ url: dataUrl, created: Date.now(), fileName: file.name });
            try {
                localStorage.setItem('gallery_data', JSON.stringify(store));
                console.log('Saved to localStorage', store);
                alert('Image saved. Open gallery.html to view it.');
                // optional: update other UI or navigate:
                // window.location.href = 'gallery.html';
            } catch (err) {
                console.error('Failed to save to localStorage', err);
                alert('Save failed (maybe too large).');
            }
            
        },

        refreshFromStorage() {
            console.log('Refreshing from storage');
            const stored = JSON.parse(localStorage.getItem('gallery_data') || '{}');
            console.log('Current storage data:', stored);
            
            Object.entries(stored).forEach(([category, items]) => {
                if (this[category]) {
                    items.forEach(item => {
                        if (!this[category].some(existing => existing.url === item.url)) {
                            console.log(`Adding new item to ${category}:`, item);
                            this[category].push(item);
                        }
                    });
                }
            });
        },
        // changed code: delete item from category and update localStorage
        deleteArt(category, index) {
            if (!confirm('Delete this image?')) return;
            const item = this[category] && this[category][index];
            if (!item) return;

            // remove from reactive array
            this[category].splice(index, 1);

            // remove from persisted store (match by url where possible)
            try {
                const store = JSON.parse(localStorage.getItem('gallery_data') || '{}');
                if (store[category] && store[category].length) {
                    const targetUrl = (item.url || item).toString();
                    const pos = store[category].findIndex(i => (i && (i.url || i).toString()) === targetUrl);
                    if (pos !== -1) store[category].splice(pos, 1);
                    // if array becomes empty you may want to delete the key:
                    if (store[category].length === 0) delete store[category];
                    localStorage.setItem('gallery_data', JSON.stringify(store));
                }
            } catch (err) {
                console.error('Failed to update localStorage during delete', err);
            }
        },
    },

    mounted() {
        console.log('Vue app mounted');
        this.refreshFromStorage();
        
        // Refresh when page becomes visible again
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.refreshFromStorage();
            }
        });
    }
})




// Form handler for insert.html
const insertForm = document.getElementById('insertForm');
if (insertForm) {
    console.log('Form found, adding submit handler');
    insertForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        const category = document.getElementById('artCategory').value;
        console.log('Selected category:', category);
        
        const file = document.getElementById('artFile').files[0];
        console.log('File selected:', file?.name);
        
        if (!file) {
            alert('Please choose an image file.');
            return;
        }

        try {
            // Read file
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    console.log('FileReader completed');
                    resolve(reader.result);
                };
                reader.onerror = reject;
                console.log('Starting FileReader...');
                reader.readAsDataURL(file);
            });

            console.log('File converted to data URL');

            // Get existing data
            let store;
            try {
                store = JSON.parse(localStorage.getItem('gallery_data') || '{}');
                console.log('Current storage:', store);
            } catch (e) {
                console.error('Error reading localStorage:', e);
                store = {};
            }

            // Initialize category array if needed
            store[category] = store[category] || [];

            // Add new item
            const newItem = {
                url: dataUrl,
                created: Date.now(),
                fileName: file.name
            };
            store[category].push(newItem);
            console.log(`Added item to ${category}:`, newItem);

            // Save back to localStorage
            try {
                localStorage.setItem('gallery_data', JSON.stringify(store));
                console.log('Successfully saved to localStorage');
                
                // Verify save
                const verification = localStorage.getItem('gallery_data');
                const parsed = JSON.parse(verification);
                console.log('Verification - data in storage:', parsed);
                
                if (parsed[category]?.length > 0) {
                    alert('Image saved successfully! Redirecting to gallery...');
                    window.location.href = 'gallery.html';
                } else {
                    throw new Error('Verification failed - category is empty');
                }
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                alert('Error saving image. Please try again.');
            }
        } catch (err) {
            console.error('Error in form submission:', err);
            alert('Error processing image. Please try again.');
        }
    });
}

// Make app globally available
window.app = app;