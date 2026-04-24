// 解决方案数据 - 完整解决方案信息
const solutionsData = {
    retail: {
        id: "retail",
        name: "快消零售供应链解决方案",
        nameEn: "FMCG Retail Supply Chain Solution",
        icon: "🛒",
        heroTitle: "新零售时代，供应链为王",
        heroTitleEn: "New Retail Era, Supply Chain is King",
        heroDesc: "针对快消零售行业特点，八米提供从采购、仓储、配送到终端销售的全链路数字化解决方案。支持统仓共配、多仓协同、门店配送、逆向物流等复杂业务场景，帮助零售企业实现供应链降本增效，提升终端竞争力。",
        heroDescEn: "BAMI provides end-to-end digital supply chain solutions for FMCG retail, supporting unified warehousing, multi-warehouse collaboration, and store delivery.",
        painPoints: [
            { title: "库存积压", desc: "需求预测不准确，库存周转慢，资金占用高" },
            { title: "配送成本高", desc: "配送路线规划不合理，车辆装载率低" },
            { title: "渠道冲突", desc: "线上线下库存不共享，渠道间协调困难" },
            { title: "响应慢", desc: "订单处理效率低，客户需求响应不及时" }
        ],
        features: [
            { icon: "📊", title: "智能需求预测", desc: "基于AI算法预测销量，优化库存结构，减少积压" },
            { icon: "🏭", title: "统仓共配", desc: "多品牌共享仓储资源，降低仓储成本30%" },
            { icon: "🚚", title: "智能配送调度", desc: "路径优化算法，提升配送效率，降低成本" },
            { icon: "📱", title: "全渠道协同", desc: "线上线下库存共享，订单统一处理" }
        ],
        modules: [
            { name: "需求预测", desc: "AI销量预测，智能补货建议" },
            { name: "库存管理", desc: "多仓库存统一管理，实时可视化" },
            { name: "配送管理", desc: "智能调度，路径优化，配送跟踪" },
            { name: "门店协同", desc: "门店库存、订单、配送协同" },
            { name: "促销管理", desc: "促销活动规划、执行、分析" },
            { name: "数据分析", desc: "销售分析、库存分析、成本分析" }
        ],
        benefits: [
            { value: "30%", label: "仓储成本降低" },
            { value: "50%", label: "库存周转提升" },
            { value: "25%", label: "配送效率提升" },
            { value: "99%", label: "订单准确率" }
        ],
        cases: [
            { client: "APOLLOTECH", result: "东南亚4PL统仓共配解决方案，覆盖菲律宾、马来西亚" },
            { client: "某连锁便利店", result: "统仓共配，配送成本降低30%" },
            { client: "某快消品牌", result: "全渠道库存共享，库存周转提升50%" }
        ]
    },
    
    pharma: {
        id: "pharma",
        name: "医药物流解决方案",
        nameEn: "Pharmaceutical Logistics Solution",
        icon: "💊",
        heroTitle: "合规高效的医药供应链",
        heroTitleEn: "Compliant and Efficient Pharma Supply Chain",
        heroDesc: "针对医药行业GSP/GMP合规要求，八米提供全程可追溯、温湿度监控、效期管理的医药供应链解决方案。支持医疗器械UDI追溯、药品电子监管码、冷链全程温控，满足医药物流严格的合规要求。",
        heroDescEn: "BAMI provides pharma supply chain solutions with full traceability, temperature monitoring, and expiry management meeting GSP/GMP requirements.",
        painPoints: [
            { title: "合规风险", desc: "GSP要求严格，追溯链条不完整，合规风险高" },
            { title: "温控难题", desc: "冷链断链风险，温湿度监控困难" },
            { title: "效期管理", desc: "药品效期管理复杂，近效期损耗大" },
            { title: "追溯困难", desc: "批次追溯链条长，召回效率低" }
        ],
        features: [
            { icon: "📋", title: "全程追溯", desc: "批次/序列号全程追溯，满足GSP合规要求" },
            { icon: "🌡️", title: "温湿度监控", desc: "冷链全程温湿度实时监控，异常预警" },
            { icon: "⏰", title: "效期管理", desc: "先进先出、近效期预警、自动锁库" },
            { icon: "🔍", title: "UDI追溯", desc: "医疗器械UDI全生命周期追溯管理" }
        ],
        modules: [
            { name: "批次管理", desc: "药品批次、序列号全流程管理" },
            { name: "温控管理", desc: "冷库、冷藏车温湿度监控" },
            { name: "效期预警", desc: "近效期预警、自动锁库、报废管理" },
            { name: "GSP报表", desc: "符合GSP要求的各类报表" },
            { name: "追溯查询", desc: "正向追溯、反向追溯、召回管理" },
            { name: "资质管理", desc: "供应商、客户资质管理、到期预警" }
        ],
        benefits: [
            { value: "100%", label: "合规追溯" },
            { value: "0", label: "断链风险" },
            { value: "80%", label: "追溯效率提升" },
            { value: "60%", label: "近效期损耗降低" }
        ],
        cases: [
            { client: "金域医学", result: "医检样本全程冷链追溯，获抗疫特别贡献奖" },
            { client: "贝恩医疗", result: "医疗器械UDI追溯管理，合规效率提升200%" },
            { client: "某医药商业", result: "GSP合规管理，通过药监检查零缺陷" }
        ]
    },
    
    crossborder: {
        id: "crossborder",
        name: "跨境电商物流解决方案",
        nameEn: "Cross-border E-commerce Solution",
        icon: "🌐",
        heroTitle: "全球卖，本地送",
        heroTitleEn: "Sell Globally, Deliver Locally",
        heroDesc: "针对跨境电商特点，八米提供从国内集货、国际运输、海外清关到末端配送的全链路解决方案。支持多平台订单接入（亚马逊、eBay、Shopify等）、海外仓管理、跨境小包追踪，帮助跨境卖家实现全球业务扩张。",
        heroDescEn: "BAMI provides end-to-end cross-border e-commerce logistics solutions from domestic consolidation to last-mile delivery.",
        painPoints: [
            { title: "多平台管理", desc: "订单分散在多个平台，统一管理困难" },
            { title: "物流成本高", desc: "国际运费占比高，利润空间被压缩" },
            { title: "时效不稳定", desc: "跨境运输环节多，时效难以保证" },
            { title: "退换货难", desc: "跨境退换货成本高，客户体验差" }
        ],
        features: [
            { icon: "🔗", title: "多平台对接", desc: "对接100+电商平台，订单自动抓取" },
            { icon: "🏭", title: "海外仓管理", desc: "头程、仓储、尾程一体化管理" },
            { icon: "💰", title: "智能运费", desc: "多渠道运费比价，选择最优方案" },
            { icon: "🔄", title: "退换货管理", desc: "海外仓退货处理，降低退换成本" }
        ],
        modules: [
            { name: "平台对接", desc: "亚马逊、eBay、Shopify等平台订单接入" },
            { name: "头程管理", desc: "国内集货、国际运输、清关" },
            { name: "海外仓WMS", desc: "海外仓库存、订单、发货管理" },
            { name: "尾程配送", desc: "本地配送渠道对接、跟踪" },
            { name: "退换货", desc: "退货入库、质检、重新上架" },
            { name: "财务结算", desc: "多币种结算、成本核算" }
        ],
        benefits: [
            { value: "100+", label: "平台对接" },
            { value: "40%", label: "物流成本降低" },
            { value: "3x", label: "发货效率提升" },
            { value: "98%", label: "客户满意度" }
        ],
        cases: [
            { client: "弘海铁盛", result: "非洲代购集运，业务自动化处理" },
            { client: "某跨境大卖", result: "海外仓+直邮双模式，物流成本降低40%" },
            { client: "某独立站", result: "多平台订单统一管理，发货效率提升3倍" }
        ]
    },
    
    tpl: {
        id: "tpl",
        name: "第三方物流解决方案",
        nameEn: "3PL Logistics Solution",
        icon: "📦",
        heroTitle: "物流外包，专业高效",
        heroTitleEn: "Professional and Efficient Logistics Outsourcing",
        heroDesc: "针对第三方物流企业多货主、多仓、多业务场景，八米提供一套完整的数字化解决方案。支持仓运配一体化、多货主计费、客户协同门户，帮助3PL企业提升运营效率、降低管理成本、增强客户黏性。",
        heroDescEn: "BAMI provides a complete digital solution for 3PL enterprises with multi-owner, multi-warehouse scenarios.",
        painPoints: [
            { title: "多货主管理", desc: "不同货主要求不同，统一管理困难" },
            { title: "计费复杂", desc: "计费规则多样，人工核算易出错" },
            { title: "客户协同", desc: "信息不透明，客户查询、对账效率低" },
            { title: "资源整合", desc: "仓、运、配资源分散，协同效率低" }
        ],
        features: [
            { icon: "👥", title: "多货主管理", desc: "独立库存、独立计费、独立报表" },
            { icon: "💵", title: "灵活计费", desc: "多维度计费引擎，自动核算对账" },
            { icon: "🖥️", title: "客户门户", desc: "客户自助查询、下单、对账" },
            { icon: "🔗", title: "仓运配一体", desc: "仓储、运输、配送无缝协同" }
        ],
        modules: [
            { name: "货主管理", desc: "多货主档案、合同、价格管理" },
            { name: "仓库管理", desc: "多仓库存、作业、绩效管理" },
            { name: "运输管理", desc: "车辆调度、运输跟踪、运费结算" },
            { name: "客户门户", desc: "客户自助查询、下单、报表" },
            { name: "计费结算", desc: "自动计费、对账、开票" },
            { name: "数据分析", desc: "运营分析、成本分析、客户分析" }
        ],
        benefits: [
            { value: "50%", label: "人工成本降低" },
            { value: "90%", label: "计费效率提升" },
            { value: "80%", label: "客户满意度提升" },
            { value: "3x", label: "订单处理能力" }
        ],
        cases: [
            { client: "四季安物流", result: "4A级物流企业全系统部署，数字化转型标杆" },
            { client: "某三方物流", result: "多货主计费自动化，财务效率提升90%" },
            { client: "某供应链企业", result: "仓运配一体化，运营成本降低30%" }
        ]
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { solutionsData };
}
