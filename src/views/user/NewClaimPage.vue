<template>
    <Fluid>
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <h2 class="text-xl text-gray-800 font-semibold">
                    Trimite o sesizare către primărie
                </h2>
                <p class="text-gray-600 mb-6">
                    Completează formularul de mai jos, apoi generează reclamația în format PDF.
                    Descarcă documentul și trimite-l la adresa de email oficială a primariei, afișată mai jos.
                </p>

                <div class="flex flex-wrap gap-2 w-full">
                    <label for="state">Tip problemă</label>
                    <Select
                        id="state"
                        v-model="categorie"
                        :options="categorii"
                        optionLabel="name"
                        placeholder="Selectează o categorie"
                        class="w-full"
                    />
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="firstname2">Nume</label>
                        <InputText id="firstname2" type="text" v-model="firstname" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="lastname2">Prenume</label>
                        <InputText id="lastname2" type="text" v-model="lastname" />
                    </div>
                </div>

                <div class="flex flex-wrap">
                    <label for="address">Adresă domiciliu</label>
                    <Textarea id="address" rows="4" v-model="address" />
                </div>

                <div class="flex flex-wrap gap-2 w-full">
                    <label for="state">Sector</label>
                    <Select
                        id="state"
                        v-model="sector"
                        :options="denumireSectoare"
                        optionLabel="name"
                        placeholder="Selectează un sector"
                        class="w-full"
                    />
                </div>

                <div class="flex items-center">
                    <Checkbox v-model="differentAddress" id="different_address" binary class="mr-2"></Checkbox>
                    <label for="rememberme1">Locația problemei diferă de adresa de domiciliu</label>
                </div>

                <template v-if="differentAddress">
                    <div class="flex flex-wrap">
                        <label for="address">Locația problemei</label>
                        <Textarea id="address" rows="4" v-model="problemAddress" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="state">Sector</label>
                        <Select
                            id="state"
                            v-model="problemSector"
                            :options="denumireSectoare"
                            optionLabel="name"
                            placeholder="Selectează un sector"
                            class="w-full"
                        />
                    </div>
                </template>

                <div class="flex flex-wrap">
                    <label for="description">Descrierea detaliată a problemei</label>
                    <Textarea id="description" rows="4" v-model="description" />
                </div>

                <div class="border border-gray-300 rounded p-4 w-full max-w-md">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Semnătură</label>
                    <canvas ref="signatureCanvas" width="300" height="150" class="border rounded bg-white"></canvas>

                    <div class="flex gap-4 mt-2">
                        <button @click="clearSignature" type="button" class="text-blue-600 text-sm">Șterge</button>
                    </div>
                </div>

                <div class="flex justify-center">
                    <Button @click="generatePDF()" label="Generează fișier PDF" class="w-1/2 px-6 py-3 mt-5 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg">
                    </Button>
                </div>

                <template v-if="emailPrimarie != ''">
                    <p class="mt-4 font-medium text-[#213c8d] text-l">
                        Trimite sesizarea la email-ul oficial:
                        <a class="underline text-blue-600 hover:text-blue-800">{{ emailPrimarie }}</a>
                    </p>
                </template>
            </div>
        </div>
    </Fluid>
</template>

<script setup lang="ts">

import jsPDF from "jspdf";
import {computed, onMounted, ref, watch} from "vue";
import SignaturePad from "signature_pad";
import axios from "axios";
import Swal from "sweetalert2";

const firstname = ref('');
const lastname = ref('');
const differentAddress = ref(false);
const sector = ref({});
const problemSector = ref({});
const address = ref('');
const problemAddress = ref('');
const emailPrimarie = ref('');
const description = ref('');
const denumireSectoare = ref([
    { name: 'Sector 1', code: '1', email: 'registratura@primarias1.ro'},
    { name: 'Sector 2', code: '2', email: 'infopublice@ps2.ro'},
    { name: 'Sector 3', code: '3', email: 'contact@primaria3.ro'},
    { name: 'Sector 4', code: '4', email: 'contact@ps4.ro' },
    { name: 'Sector 5', code: '5', email: 'contact@vladpopescupiedone.ro'},
    { name: 'Sector 6', code: '6', email: 'prim6@primarie6.ro' }
]);
const user = JSON.parse(localStorage.getItem('user'));
const categorie = ref(null);
const categorii = ref([
    { name: 'salubritate', code: '1' },
    { name: 'infrastructura', code: '2' },
    { name: 'iluminat publica', code: '3' },
    { name: 'spatii verzi', code: '4' },
    { name: 'masini abandonate', code: '5' },
    { name: 'ordine și liniste publica', code: '6' },
    { name: 'animale fara stapan', code: '7' },
    { name: 'probleme canalizare', code: '8' },
    { name: 'semnalizare rutiera', code: '9' },
    { name: 'probleme de siguranta publica', code: '10' },
]);

const emailSectoare = [
    { name: 'Sector 1', email: 'registratura@primarias1.ro' },
    { name: 'Sector 2', email: 'infopublice@ps2.ro' },
    { name: 'Sector 3', email: 'contact@primaria3.ro' },
    { name: 'Sector 4', email: 'contact@ps4.ro' },
    { name: 'Sector 5', email: 'contact@vladpopescupiedone.ro' },
    { name: 'Sector 6', email: 'prim6@primarie6.ro' },

];

const signatureCanvas = ref<HTMLCanvasElement | null>(null);
let signaturePad: SignaturePad;

const clearSignature = () => {
    signaturePad?.clear();
};

const getSignatureImage = (): string | null => {
    if (!signaturePad || signaturePad.isEmpty()) return null;
    return signaturePad.toDataURL('image/png');
};

const storeComplaint = async() => {
    let title = '';
    let complaintAddress = '';
    let priority = 0;

    if(differentAddress.value)
    {
        title = 'Sesizare privind ' + categorie.value.name + ' în ' + problemSector.value.name;
        complaintAddress = address.value + ',' + problemSector.value.name;
    } else {
        title = 'Sesizare privind ' + categorie.value.name + ' în ' + sector.value.name;
        complaintAddress = address.value + ',' + sector.value.name;
    }

    switch (categorie.value.name) {
        case 'infrastructura':
            priority = 3;
            break;
        case 'gunoi':
            priority = 2;
            break;
        case 'probleme de siguranta publica':
            priority = 5;
            break;
        default:
            priority = 1;
            break;
    }

    await axios.post('http://api.claim-flow.dev.eiddew.com/api/complaints', {
        title: title,
        description: description.value,
        category: categorie.value.name,
        address: complaintAddress,
        user_id: user.id,
        priority: priority
    }).then((response) => {
        console.log('r',response);
    }).catch((error) => {
        console.log('eeee', error)
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })
}
const generatePDF = () => {
    storeComplaint();
    const doc = new jsPDF({
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
    });

    const pageWidth = 210;
    const margin = 20;
    const maxLineWidth = pageWidth - 2 * margin;

    let y = 20;

    doc.setFont("times", "normal");
    doc.setFontSize(16);

    doc.text("Sesizare catre Primarie", margin, y);
    y += 15;

    doc.setFontSize(12);

    const today = new Date().toLocaleDateString("ro-RO");
    doc.text(`Data: ` + today, margin, y);

    y += 15;

    if ((differentAddress.value) && (problemSector != null)) {
        doc.text(`Catre: Primaria ` + problemSector.value.name, margin, y);
    } else {
        doc.text(`Catre: Primaria ` + sector.value.name, margin, y);
    }
    y += 10;

    doc.text(`Subiect: sesizare privind ` + categorie.value.name, margin, y);
    y += 15;

    const addParagraph = (text) => {
        const splitText = doc.splitTextToSize(text, maxLineWidth);
        doc.text(splitText, margin, y);
        y += splitText.length * 7;
    };

    addParagraph("Stimate/domnule/doamna Primar,");

    y += 10;

    addParagraph(
        'Subsemnatul/a ' + firstname.value + ' ' + lastname.value + ' cu domiciliul pe ' + address.value + ',' + sector.value.name + ', va adresez prezenta sesizare în legatura cu urmatoarea problema.'
    );

    if(differentAddress.value)
    {
        addParagraph(`Adresa problemei: ` + problemAddress.value + ',' + problemSector.value.name);
    }

    y += 8;

    addParagraph("Descrierea problemei:");
    addParagraph(description.value || "Nu a fost furnizată o descriere.");

    y += 10;

    // const today = new Date().toLocaleDateString("ro-RO");
    addParagraph(`Solicit interventia autoritatilor competente pentru rezolvarea acestei probleme si va rog sa ma tineti la curent cu demersurile intreprinse in acest sens. `);

    y += 10;

    addParagraph('Va multumesc anticipat pentru atentia acordata acestei sesizari si pentru eforturile depuse in rezolvarea problemei.')

    y += 10;

    const signatureImage = getSignatureImage(); // apel din funcția care returnează base64

    if (signatureImage) {
        doc.text("Semnatura:", margin, y);
        y += 5;
        doc.addImage(signatureImage, 'PNG', margin, y, 60, 30);
        y += 40;
    } else {
        doc.text("Semnatura: ____________________", margin, y);
        y += 10;
    }
    doc.save("sesizare_primarie.pdf");
};


onMounted(() => {
    if (signatureCanvas.value) {
        signaturePad = new SignaturePad(signatureCanvas.value);
    }

    getSignatureImage();
});

const sectorToWatch = computed(() => {
    return differentAddress.value ? problemSector.value : sector.value;
});

watch(sectorToWatch, (newSector) => {
    if (newSector && newSector.email) {
        emailPrimarie.value = newSector.email;
    } else {
        emailPrimarie.value = '';
    }
});

</script>
