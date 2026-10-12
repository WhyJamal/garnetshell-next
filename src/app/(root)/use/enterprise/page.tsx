import { InfoPage } from "@/components/marketing/info-page";
import { CONFIG } from "@/config/app.config";
import { PAGES } from "@/config/pages.config";

export default function EnterprisePage() { 
    return (
        <InfoPage 
            eyebrow="Для предприятий" 
            title="Корпоративная платформа под сложные процессы и интеграции." 
            description={`Для крупных организаций важны управляемость, интеграции и контроль данных. Именно вокруг этого строится ${CONFIG.appName}.`} 
            cta={{label:"Обсудить архитектуру",href:PAGES.CONTACTS}} 
            items={[
                {title:"Сложные структуры",text:"Организации, подразделения, проекты и роли можно выстраивать в единой модели."},
                {title:"Интеграции",text:"Подключайте существующие корпоративные системы и внутренние сервисы."},
                {title:"Контроль доступа",text:"Разделяйте права и рабочие зоны по структуре компании."},
                {title:"Индивидуальное внедрение",text:"Обсудим архитектуру и этапы внедрения под ваши процессы."}
            ]} 
        />
    ); 
}
