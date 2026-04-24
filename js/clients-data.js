// 客户案例数据 - 真实客户信息
const clientsData = {
    featured: [
        {
            id: "kingmed",
            name: "金域医学",
            nameEn: "Kingmed",
            industry: "医疗健康",
            industryEn: "Healthcare",
            subIndustry: "第三方医学检验",
            logo: "images/clients/client-kingmed.png",
            description: "为金域医学快速上线TMS+WMS支撑与运维抗疫期间大数据并发的技术服务，获抗疫特别贡献奖",
            descriptionEn: "Implemented TMS+WMS for Kingmed during pandemic, awarded Special Contribution Award"
        },
        {
            id: "bain",
            name: "贝恩医疗",
            nameEn: "Bain Medical",
            industry: "医疗器械",
            industryEn: "Medical Device",
            subIndustry: "高值耗材",
            logo: "images/clients/client-bain.png",
            description: "八米科技与贝恩医疗达成WMS仓储管理系统合作协议，实现医疗器械全链路数字化管理",
            descriptionEn: "WMS cooperation agreement for medical device digital management"
        },
        {
            id: "jiatuo",
            name: "嘉拓智能",
            nameEn: "Jiatuo Smart",
            industry: "新能源",
            industryEn: "New Energy",
            subIndustry: "锂电设备",
            logo: "images/clients/client-jiatuo.png",
            description: "与嘉拓智能正式达成战略合作，TMS项目签约并全面启动，构建全球运输管理平台",
            descriptionEn: "Strategic TMS partnership for global transportation management"
        },
        {
            id: "chinapost",
            name: "中国邮政",
            nameEn: "China Post",
            industry: "邮政物流",
            industryEn: "Postal Logistics",
            subIndustry: "快递配送",
            logo: "images/clients/client-chinapost.png",
            description: "为中国邮政提供物流供应链数字智能化管理服务",
            descriptionEn: "Supply chain digitalization services for China Post"
        },
        {
            id: "nippon",
            name: "日本通运",
            nameEn: "Nippon Express",
            industry: "国际物流",
            industryEn: "Intl Logistics",
            subIndustry: "供应链",
            logo: "images/clients/client-nippon.png",
            description: "为国际知名物流上市企业提供物流系统开发与供应链服务",
            descriptionEn: "Logistics system development for international logistics enterprise"
        },
        {
            id: "shenghui",
            name: "晟晖集团",
            nameEn: "Shenghui Group",
            industry: "再生资源",
            industryEn: "Recycling",
            subIndustry: "资源回收",
            logo: "images/clients/client-shenghui.png",
            description: "打造全国领先的AI数智化再生资源平台，实现全流程可视化运营",
            descriptionEn: "AI digital recycling resource platform with full-process visibility"
        }
    ],
    
    all: [
        { id: 1, name: "金域医学", logo: "images/clients/client-01.png", industry: "医疗健康" },
        { id: 2, name: "贝恩医疗", logo: "images/clients/client-02.png", industry: "医疗器械" },
        { id: 3, name: "嘉拓智能", logo: "images/clients/client-03.png", industry: "新能源" },
        { id: 4, name: "晟晖集团", logo: "images/clients/client-04.png", industry: "再生资源" },
        { id: 5, name: "日本通运", logo: "images/clients/client-05.png", industry: "国际物流" },
        { id: 6, name: "中国邮政", logo: "images/clients/client-06.png", industry: "邮政物流" },
        { id: 7, name: "四季安物流", logo: "images/clients/client-07.png", industry: "零担物流" },
        { id: 8, name: "弘海铁盛", logo: "images/clients/client-08.png", industry: "国际集运" },
        { id: 9, name: "思泰科技", logo: "images/clients/client-09.png", industry: "智能制造" },
        { id: 10, name: "科玺资本", logo: "images/clients/client-10.png", industry: "投资" },
        { id: 11, name: "APOLLOTECH", logo: "images/clients/client-11.png", industry: "IT服务" },
        { id: 12, name: "贝壳找房", logo: "images/clients/client-12.png", industry: "房产服务" },
        { id: 13, name: "振业集团", logo: "images/clients/client-13.png", industry: "物流" },
        { id: 14, name: "恒隆物流", logo: "images/clients/client-14.png", industry: "第三方物流" },
        { id: 15, name: "联动科技", logo: "images/clients/client-15.png", industry: "科技" },
        { id: 16, name: "亿兴物流", logo: "images/clients/client-16.png", industry: "物流" },
        { id: 17, name: "万和物流", logo: "images/clients/client-17.png", industry: "物流" },
        { id: 18, name: "宇华物流", logo: "images/clients/client-18.png", industry: "物流" },
        { id: 19, name: "德邦物流", logo: "images/clients/client-19.png", industry: "快递" }
    ],
    
    caseStudies: [
        {
            id: "jiatuo",
            client: "嘉拓智能",
            title: "TMS项目 - 智慧物流新标杆",
            titleEn: "TMS Project - Smart Logistics Benchmark",
            industry: "新能源装备制造",
            challenge: "嘉拓智能作为中国锂电设备国际化发展的先驱，业务覆盖全球，拥有多处研发与生产基地，复杂的业务网络对供应链协同、透明与高效管理提出极高要求",
            solution: "部署八米科技TMS运输管理系统，构建一体化、智能化、可视化的全球运输管理平台，全面整合从国内到国际的物流运输业务",
            results: ["实现从订单下达到费用结算的全流程数字化管理", "物流执行效率显著提升", "供应链韧性增强", "通过数据智能分析为管理决策提供有力支持"],
            tags: ["TMS", "运输管理", "全球配送"],
            image: "images/cases/case-jiatuo.jpg"
        },
        {
            id: "shenghui",
            client: "晟晖集团",
            title: "AI数智化再生资源平台",
            titleEn: "AI Digital Recycling Resource Platform",
            industry: "再生资源循环",
            challenge: "作为华南地区最具影响力的再生资源产业集团，靠传统人工经验推动的运营模式难以满足大规模、高协同、智能决策的经营要求",
            solution: "八米科技注入最新的AI智能体引擎，打造面向未来的智能再生资源运营平台，实现回收→入库→加工→销售的全流程可视化运营",
            results: ["实现全流程可视化运营", "建设AI任务调度系统，实现实时调配与追踪", "老板驾驶舱一键掌握全局数据", "以数据驱动绩效与决策，推动集团高质量增长"],
            tags: ["AI智能体", "再生资源", "数字化运营"],
            image: "images/cases/case-shenghui.jpg"
        },
        {
            id: "kingmed",
            client: "金域医学",
            title: "抗疫特别贡献奖项目",
            titleEn: "Anti-epidemic Special Contribution Award",
            industry: "第三方医学检验",
            challenge: "2020年疫情期间，金域医学需要快速支撑抗疫期间大数据并发的技术服务",
            solution: "八米科技为金域医学快速上线TMS+WMS系统，支撑与运维抗疫期间大数据并发的技术服务",
            results: ["快速上线，支撑抗疫工作", "大数据并发处理能力", "获得金域医学抗疫特别贡献奖"],
            tags: ["TMS", "WMS", "医疗物流"],
            image: "images/cases/case-kingmed.jpg"
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { clientsData };
}
