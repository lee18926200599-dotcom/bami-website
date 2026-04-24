// 产品数据 - 完整产品信息
const productsData = {
    ai: {
        id: "ai",
        name: "AI数字员工",
        nameEn: "AI Digital Workforce",
        badge: "旗舰产品",
        badgeEn: "Flagship Product",
        icon: "🤖",
        heroTitle: "7×24小时不间断工作的智能团队",
        heroTitleEn: "24/7 Intelligent Workforce",
        heroDesc: "基于大语言模型和机器学习技术，八米AI数字员工为企业提供四大核心能力：智能拓客引擎自动识别潜在客户并推荐触达策略；全渠道客服中枢统一接入微信、电话、网页等渠道，智能回复准确率95%+；数据决策指挥官实时分析业务数据，提供决策建议；智能管理协作者协助处理日常管理事务，提升团队协作效率。帮助企业节省80%人力成本，提升3倍运营效率。",
        heroDescEn: "Based on LLM and machine learning, BAMI AI Digital Workforce provides four core capabilities for enterprises.",
        stats: [
            { value: "95%", label: "智能回复准确率", labelEn: "AI Response Accuracy" },
            { value: "80%", label: "人力成本节省", labelEn: "Labor Cost Savings" },
            { value: "3x", label: "运营效率提升", labelEn: "Efficiency Improvement" },
            { value: "24/7", label: "不间断服务", labelEn: "Non-stop Service" }
        ],
        features: [
            {
                icon: "🎯",
                title: "智能拓客引擎",
                titleEn: "Smart Acquisition Engine",
                desc: "自动识别潜在客户，智能推荐触达策略，提升获客效率200%",
                descEn: "Auto-identify prospects and recommend outreach strategies, improving acquisition by 200%"
            },
            {
                icon: "💬",
                title: "全渠道客服中枢",
                titleEn: "Omnichannel Service Hub",
                desc: "统一接入微信、电话、网页等渠道，智能回复准确率95%+",
                descEn: "Unified access to WeChat, phone, web channels with 95%+ response accuracy"
            },
            {
                icon: "📊",
                title: "数据决策指挥官",
                titleEn: "Data Decision Commander",
                desc: "实时分析业务数据，提供决策建议，让数据驱动增长",
                descEn: "Real-time business data analysis with decision recommendations"
            },
            {
                icon: "🤝",
                title: "智能管理协作者",
                titleEn: "Intelligent Management Collaborator",
                desc: "协助处理日常管理事务，提升团队协作效率",
                descEn: "Assist with daily management tasks and improve team collaboration"
            }
        ],
        modules: [
            { name: "智能拓客", desc: "基于AI算法的客户识别与推荐系统" },
            { name: "智能客服", desc: "7×24小时多语言自动客服响应" },
            { name: "数据分析", desc: "实时业务数据分析与可视化" },
            { name: "智能调度", desc: "任务智能分配与进度跟踪" },
            { name: "知识库", desc: "企业专属知识库构建与维护" },
            { name: "报表生成", desc: "自动化业务报表生成与分发" }
        ],
        useCases: [
            { client: "晟晖集团", result: "AI任务调度系统实现实时调配与追踪" },
            { client: "四季安物流", result: "客服响应效率提升300%" },
            { client: "贝恩医疗", result: "销售线索转化率提升150%" }
        ]
    },
    
    wms: {
        id: "wms",
        name: "WMS仓储管理系统",
        nameEn: "WMS Warehouse Management",
        badge: "核心产品",
        badgeEn: "Core Product",
        icon: "📦",
        heroTitle: "智能仓储，精准管控",
        heroTitleEn: "Smart Warehousing, Precise Control",
        heroDesc: "八米WMS仓储管理系统提供从入库、库内管理到出库的全流程数字化管控。系统支持多仓库、多货主管理，实时库存可视化，智能拣货路径优化，条码/RFID全程追溯。与TMS、OMS无缝对接，实现仓运配一体化管理。广泛应用于电商仓、跨境仓、医药物流仓、冷链仓等场景。",
        heroDescEn: "BAMI WMS provides full-process digital control from receiving to shipping, supporting multi-warehouse management and real-time inventory visualization.",
        stats: [
            { value: "99.9%", label: "库存准确率", labelEn: "Inventory Accuracy" },
            { value: "50%", label: "拣货效率提升", labelEn: "Picking Efficiency" },
            { value: "30%", label: "仓储成本降低", labelEn: "Cost Reduction" },
            { value: "100%", label: "全程可追溯", labelEn: "Full Traceability" }
        ],
        features: [
            {
                icon: "📍",
                title: "智能库位管理",
                titleEn: "Smart Location Management",
                desc: "AI算法优化库位分配，提升空间利用率30%",
                descEn: "AI-optimized location allocation, improving space utilization by 30%"
            },
            {
                icon: "📋",
                title: "批次与序列号追溯",
                titleEn: "Batch & Serial Tracking",
                desc: "全流程批次/序列号管理，满足医药、食品等行业合规要求",
                descEn: "Full-process batch/serial tracking for pharmaceutical and food compliance"
            },
            {
                icon: "📊",
                title: "库存实时可视化",
                titleEn: "Real-time Inventory Visibility",
                desc: "多维度库存报表，预警提示，决策支持",
                descEn: "Multi-dimensional inventory reports with alerts and decision support"
            },
            {
                icon: "🔄",
                title: "仓运配一体化",
                titleEn: "Warehouse-Transport Integration",
                desc: "与TMS、OMS无缝对接，实现供应链协同",
                descEn: "Seamless integration with TMS and OMS for supply chain collaboration"
            }
        ],
        modules: [
            { name: "入库管理", desc: "收货、质检、上架全流程管理" },
            { name: "库存管理", desc: "实时库存查询、盘点、调拨" },
            { name: "出库管理", desc: "波次管理、拣货、复核、发货" },
            { name: "库内作业", desc: "补货、移库、加工、报废" },
            { name: "报表分析", desc: "库存周转、作业效率、成本分析" },
            { name: "系统集成", desc: "与ERP、TMS、OMS系统对接" }
        ],
        useCases: [
            { client: "贝恩医疗", result: "医疗器械仓储合规管理，追溯效率提升200%" },
            { client: "金域医学", result: "医检样本全程冷链追溯管理" },
            { client: "晟晖集团", result: "再生资源仓储数字化，库存准确率达99.9%" }
        ]
    },
    
    tms: {
        id: "tms",
        name: "TMS运输管理系统",
        nameEn: "TMS Transportation Management",
        badge: "核心产品",
        badgeEn: "Core Product",
        icon: "🚚",
        heroTitle: "智能调度，全程可视",
        heroTitleEn: "Smart Dispatch, Full Visibility",
        heroDesc: "八米TMS运输管理系统覆盖运输全链路，从订单接收、智能调度、在途跟踪到运费结算。系统支持多式联运（公路、铁路、航空、海运），智能路径优化，电子围栏监控，异常自动预警。司机APP实现任务接收、拍照签收、运费确认全流程移动化。帮助企业降低运输成本20%，提升准时交付率至98%。",
        heroDescEn: "BAMI TMS covers the entire transportation chain from order receipt to freight settlement with multi-modal support and smart routing.",
        stats: [
            { value: "98%", label: "准时交付率", labelEn: "On-time Delivery" },
            { value: "20%", label: "运输成本降低", labelEn: "Transport Cost Savings" },
            { value: "100%", label: "全程可视化", labelEn: "Full Visibility" },
            { value: "50%", label: "调度效率提升", labelEn: "Dispatch Efficiency" }
        ],
        features: [
            {
                icon: "🧭",
                title: "智能路径规划",
                titleEn: "Smart Route Planning",
                desc: "AI算法优化运输路径，考虑路况、时效、成本多因素",
                descEn: "AI-powered route optimization considering traffic, time, and cost factors"
            },
            {
                icon: "📱",
                title: "司机移动APP",
                titleEn: "Driver Mobile App",
                desc: "任务接收、导航、拍照签收、运费确认一站式完成",
                descEn: "One-stop task management, navigation, photo POD, and payment confirmation"
            },
            {
                icon: "📍",
                title: "GPS实时追踪",
                titleEn: "GPS Real-time Tracking",
                desc: "车辆位置实时更新，电子围栏预警，异常自动报警",
                descEn: "Real-time vehicle tracking with geofence alerts and anomaly detection"
            },
            {
                icon: "💰",
                title: "智能运费结算",
                titleEn: "Smart Freight Settlement",
                desc: "多维度计费引擎，自动对账，减少人工核算90%",
                descEn: "Multi-dimensional billing engine with auto-reconciliation, reducing manual work by 90%"
            }
        ],
        modules: [
            { name: "订单管理", desc: "运输订单接收、拆分、派单" },
            { name: "智能调度", desc: "车辆调度、路径优化、配载优化" },
            { name: "在途跟踪", desc: "GPS定位、异常预警、电子围栏" },
            { name: "司机管理", desc: "司机档案、绩效、结算管理" },
            { name: "运费结算", desc: "多维度计费、自动对账、财务集成" },
            { name: "报表分析", desc: "运输成本、时效、质量分析" }
        ],
        useCases: [
            { client: "嘉拓智能", result: "全球运输管理，交付效率提升40%" },
            { client: "四季安物流", result: "大件物流智能调度，准时率达98%" },
            { client: "中国邮政", result: "配送路径优化，成本降低20%" }
        ]
    },
    
    oms: {
        id: "oms",
        name: "OMS订单管理系统",
        nameEn: "OMS Order Management",
        badge: "核心产品",
        badgeEn: "Core Product",
        icon: "📋",
        heroTitle: "全渠道订单，一站式管理",
        heroTitleEn: "Omnichannel Orders, One-stop Management",
        heroDesc: "八米OMS订单管理系统打通线上线下全渠道订单，支持电商平台（淘宝、京东、拼多多）、自营商城、线下门店订单统一接入。智能订单审核、库存分配、波次下发，支持预售、赠品、换货等复杂业务场景。与WMS、TMS无缝对接，实现订单到仓储到配送的全链路协同。订单处理效率提升3倍，库存周转率提升50%。",
        heroDescEn: "BAMI OMS unifies online and offline orders with intelligent auditing, inventory allocation, and seamless WMS/TMS integration.",
        stats: [
            { value: "3x", label: "订单处理效率", labelEn: "Order Processing Efficiency" },
            { value: "50%", label: "库存周转提升", labelEn: "Inventory Turnover" },
            { value: "99.5%", label: "订单准确率", labelEn: "Order Accuracy" },
            { value: "100+", label: "平台对接", labelEn: "Platform Integrations" }
        ],
        features: [
            {
                icon: "🛒",
                title: "全渠道订单接入",
                titleEn: "Omnichannel Order Access",
                desc: "支持100+电商平台、自营商城、线下门店订单统一接入",
                descEn: "Support 100+ e-commerce platforms, self-operated malls, and offline stores"
            },
            {
                icon: "⚡",
                title: "智能订单审核",
                titleEn: "Intelligent Order Auditing",
                desc: "自动识别异常订单，智能拦截，减少售后纠纷80%",
                descEn: "Auto-detect abnormal orders, smart interception, reducing disputes by 80%"
            },
            {
                icon: "📦",
                title: "智能库存分配",
                titleEn: "Smart Inventory Allocation",
                desc: "多仓库存统一管理，智能就近分配，降低物流成本",
                descEn: "Multi-warehouse inventory management with smart nearest allocation"
            },
            {
                icon: "🔄",
                title: "复杂业务支持",
                titleEn: "Complex Business Support",
                desc: "支持预售、赠品、换货、组合销售等复杂场景",
                descEn: "Support pre-sale, gifts, exchanges, bundle sales and other complex scenarios"
            }
        ],
        modules: [
            { name: "订单接入", desc: "多平台订单自动抓取、格式转换" },
            { name: "订单处理", desc: "审核、拆分、合并、下发" },
            { name: "库存分配", desc: "多仓库存统一管理、就近分配" },
            { name: "售后管理", desc: "退换货、退款、客诉处理" },
            { name: "波次管理", desc: "智能波次生成、下发、跟踪" },
            { name: "报表分析", desc: "订单分析、销售报表、趋势预测" }
        ],
        useCases: [
            { client: "日本通运", result: "跨境订单统一管理，处理效率提升3倍" },
            { client: "弘海铁盛", result: "非洲代购集运订单自动化处理" },
            { client: "跨境电商", result: "多平台订单统一管理，库存周转提升50%" }
        ]
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { productsData };
}
