// BAMI website - Vietnamese translation catalog and DOM translator.
// The catalog intentionally uses exact page copy so the page can switch between
// Chinese, English and Vietnamese without creating a second copy of the site.
(function (window, document) {
    'use strict';

    var pairs = ((window.BAMI_NEWS_TRANSLATIONS || {}).vi || []).concat([
        ['首页', 'Trang chủ'],
        ['产品服务', 'Sản phẩm & Dịch vụ'],
        ['解决方案', 'Giải pháp'],
        ['成功案例', 'Khách hàng tiêu biểu'],
        ['客户案例', 'Khách hàng tiêu biểu'],
        ['关于我们', 'Về chúng tôi'],
        ['新闻动态', 'Tin tức'],
        ['服务支持', 'Hỗ trợ'],
        ['联系我们', 'Liên hệ'],
        ['立即咨询', 'Liên hệ ngay'],
        ['预约演示', 'Đặt lịch demo'],
        ['了解产品', 'Khám phá sản phẩm'],
        ['了解详情 →', 'Xem chi tiết →'],
        ['了解详情', 'Xem chi tiết'],
        ['免费咨询', 'Tư vấn miễn phí'],
        ['获取专属解决方案', 'Nhận giải pháp riêng'],
        ['八米科技', 'BAMI Tech'],
        ['八米', 'BAMI'],
        ['中', '中'],
        ['专注物流与供应链数智化15年', '15 năm tiên phong số hóa logistics và chuỗi cung ứng'],
        ['专注物流与供应链数字化15年', '15 năm tiên phong số hóa logistics và chuỗi cung ứng'],
        ['科技降低物流成本', 'Công nghệ giảm chi phí logistics'],
        ['驱动供应链数智化', 'Thúc đẩy chuỗi cung ứng thông minh'],
        ['科技降低物流成本驱动供应链数智化', 'Công nghệ giảm chi phí logistics, thúc đẩy chuỗi cung ứng thông minh'],
        ['15年行业经验 · 1000+企业信赖', '15 năm kinh nghiệm · 1000+ doanh nghiệp tin cậy'],
        ['八米科技专注物流与供应链领域，提供AI数字员工、WMS仓储管理、TMS运输管理、OMS订单管理四大核心产品，助力企业实现全面数智化转型。', 'BAMI Tech chuyên về logistics và chuỗi cung ứng, cung cấp bốn sản phẩm cốt lõi gồm nhân viên số AI, quản lý kho WMS, quản lý vận tải TMS và quản lý đơn hàng OMS, giúp doanh nghiệp chuyển đổi số toàn diện.'],
        ['累计服务企业', 'Doanh nghiệp đã phục vụ'],
        ['年行业经验', 'Năm kinh nghiệm'],
        ['系统稳定性', 'Độ ổn định hệ thống'],
        ['核心产品', 'Sản phẩm cốt lõi'],
        ['四大核心产品矩阵', 'Bốn sản phẩm cốt lõi'],
        ['覆盖供应链全链路，打造企业数智化核心竞争力', 'Bao phủ toàn bộ chuỗi cung ứng, kiến tạo năng lực cạnh tranh số cho doanh nghiệp'],
        ['AI数字员工', 'Nhân viên số AI'],
        ['智能拓客引擎、全渠道客服中枢、数据决策指挥官、智能管理协作者，7×24小时不间断服务。', 'Bộ máy tìm kiếm khách hàng thông minh, trung tâm chăm sóc khách hàng đa kênh, trợ lý ra quyết định bằng dữ liệu và cộng sự quản lý thông minh, phục vụ 24/7.'],
        ['智能拓客', 'Tìm khách thông minh'],
        ['智能客服', 'CSKH thông minh'],
        ['智能仓储管理系统，支持多仓协同、智能波次拣货、库存预警、批次追溯，日处理10万+订单。', 'Hệ thống quản lý kho thông minh, hỗ trợ phối hợp nhiều kho, nhặt hàng theo đợt, cảnh báo tồn kho và truy xuất theo lô, xử lý hơn 100.000 đơn/ngày.'],
        ['多仓协同', 'Phối hợp nhiều kho'],
        ['智能波次', 'Làn sóng thông minh'],
        ['智能运输管理系统，实现智能调度、路径优化、运力整合、多式联运，降低30%运输成本。', 'Hệ thống quản lý vận tải thông minh với điều độ tự động, tối ưu tuyến đường, tích hợp năng lực vận chuyển và đa phương thức, giảm 30% chi phí vận tải.'],
        ['智能调度', 'Điều độ thông minh'],
        ['路径优化', 'Tối ưu tuyến đường'],
        ['智能仓储·多仓协同', 'Kho thông minh · Phối hợp đa kho'],
        ['日处理10万+', 'Hơn 100.000 đơn/ngày'],
        ['智能调度·路径优化', 'Điều độ thông minh · Tối ưu tuyến đường'],
        ['降本30%', 'Giảm 30% chi phí'],
        ['全渠道订单·智能分配', 'Đơn hàng đa kênh · Phân bổ thông minh'],
        ['智能拓客·智能客服', 'Tìm khách thông minh · CSKH thông minh'],
        ['客户LOGO', 'Logo khách hàng'],
        ['选择系统', 'Chọn hệ thống'],
        ['系统登录', 'Đăng nhập hệ thống'],
        ['🔐 系统登录', '🔐 Đăng nhập hệ thống'],
        ['PC后台', 'Quản trị PC'],
        ['手机端', 'Ứng dụng di động'],
        ['会员端', 'Cổng hội viên'],
        ['司机端', 'Ứng dụng tài xế'],
        ['仓配WMS', 'WMS kho & phân phối'],
        ['电商WMS', 'WMS thương mại điện tử'],
        ['零担TMS', 'TMS hàng lẻ'],
        ['三方TMS', 'TMS 3PL'],
        ['跨境TMS', 'TMS xuyên biên giới'],
        ['跨境集运', 'Gom hàng xuyên biên giới'],
        ['快速链接', 'Liên kết nhanh'],
        ['广州天河盛大国际', 'Shengda International, Thiên Hà, Quảng Châu'],
        ['📍 广州天河盛大国际', '📍 Shengda International, Thiên Hà, Quảng Châu'],
        ['粤ICP备19085702号', 'Giấy phép ICP Quảng Đông số 19085702'],
        ['© 2026 BAMI 八米科技. All rights reserved.', '© 2026 BAMI Tech. Bảo lưu mọi quyền.'],
        ['© 2026 八米科技 BAMI Technology. All Rights Reserved.', '© 2026 BAMI Tech. Bảo lưu mọi quyền.'],
        ['© 2026 BAMI Technology. All Rights Reserved.', '© 2026 BAMI Tech. Bảo lưu mọi quyền.'],
        ['返回新闻列表', 'Quay lại danh sách tin tức'],
        ['← 返回新闻列表', '← Quay lại danh sách tin tức'],
        ['行业痛点', 'Điểm đau ngành'],
        ['🎯 行业痛点', '🎯 Điểm đau ngành'],
        ['方案价值', 'Giá trị giải pháp'],
        ['✅ 方案价值', '✅ Giá trị giải pháp'],
        ['业务挑战', 'Thách thức kinh doanh'],
        ['🎯 业务挑战', '🎯 Thách thức kinh doanh'],
        ['八米方案', 'Giải pháp BAMI'],
        ['💡 八米方案', '💡 Giải pháp BAMI'],
        ['项目成果', 'Kết quả dự án'],
        ['📈 项目成果', '📈 Kết quả dự án'],
        ['🎯 业务价值', '🎯 Giá trị kinh doanh'],
        ['业务价值', 'Giá trị kinh doanh'],
        ['核心指标', 'Chỉ số chính'],
        ['核心功能', 'Tính năng cốt lõi'],
        ['适用场景', 'Trường hợp áp dụng'],
        ['服务客户', 'Khách hàng đã phục vụ'],
        ['率', 'Tỷ lệ'],
        ['效率提升', 'Tăng hiệu suất'],
        ['成本降低', 'Giảm chi phí'],
        ['业务增长', 'Tăng trưởng kinh doanh'],
        ['订单准确率', 'Độ chính xác đơn hàng'],
        ['库存准确率', 'Độ chính xác tồn kho'],
        ['智能分配', 'Phân bổ thông minh'],
        ['多渠道统一接入', 'Truy cập hợp nhất đa kênh'],
        ['智能订单分配', 'Phân bổ đơn hàng thông minh'],
        ['全链路可视化', 'Hiển thị toàn bộ chuỗi'],
        ['售后管理一体化', 'Quản lý hậu mãi hợp nhất'],
        ['订单接入', 'Tiếp nhận đơn hàng'],
        ['统一接入', 'Truy cập hợp nhất'],
        ['库存同步', 'Đồng bộ tồn kho'],
        ['签收结算', 'Xác nhận giao hàng và thanh toán'],
        ['费用结算', 'Thanh toán chi phí'],
        ['运力资源整合', 'Tích hợp nguồn lực vận tải'],
        ['多仓协同管理', 'Quản lý phối hợp nhiều kho'],
        ['智能波次拣货', 'Nhặt hàng theo đợt thông minh'],
        ['波次拣货', 'Nhặt hàng theo đợt'],
        ['数据分析', 'Phân tích dữ liệu'],
        ['实时', 'Thời gian thực'],
        ['成本节省', 'Tiết kiệm chi phí'],
        ['信赖之选', 'Lựa chọn đáng tin cậy'],
        ['1000+企业的共同选择', 'Lựa chọn của hơn 1000 doanh nghiệp'],
        ['深度理解行业痛点，提供端到端的数智化转型方案', 'Thấu hiểu điểm đau ngành, cung cấp giải pháp chuyển đổi số đầu cuối'],
        ['物流行业', 'Ngành logistics'],
        ['制造业', 'Sản xuất'],
        ['电商行业', 'Thương mại điện tử'],
        ['签约仪式', 'Lễ ký kết'],
        ['合作现场', 'Hiện trường hợp tác'],
        ['旗舰产品', 'Sản phẩm chủ lực'],
        ['客户评价', 'Đánh giá khách hàng'],
        ['行业背景', 'Bối cảnh ngành'],
        ['行业管理痛点', 'Điểm đau trong quản lý ngành'],
        ['落地效果', 'Kết quả triển khai'],
        ['八米价值', 'Giá trị BAMI'],
        ['业务流程', 'Quy trình nghiệp vụ'],
        ['联系我们的专家团队，获取专属解决方案', 'Liên hệ đội ngũ chuyên gia để nhận giải pháp riêng'],
        ['八米科技 - AI数字员工与供应链数智化解决方案', 'BAMI Tech - Nhân viên số AI và giải pháp số hóa chuỗi cung ứng'],
        ['产品详情 - 八米科技', 'Chi tiết sản phẩm - BAMI Tech'],
        ['解决方案详情 - 八米科技', 'Chi tiết giải pháp - BAMI Tech'],
        ['首页 - 八米科技', 'Trang chủ - BAMI Tech'],
        ['产品服务 - 八米科技', 'Sản phẩm & Dịch vụ - BAMI Tech'],
        ['解决方案 - 八米科技', 'Giải pháp - BAMI Tech'],
        ['成功案例 - 八米科技', 'Khách hàng tiêu biểu - BAMI Tech'],
        ['关于我们 - 八米科技', 'Về chúng tôi - BAMI Tech'],
        ['新闻动态 - 八米科技', 'Tin tức - BAMI Tech'],
        ['服务支持 - 八米科技', 'Hỗ trợ - BAMI Tech'],
        ['联系我们 - 八米科技', 'Liên hệ - BAMI Tech'],
        ['提交中...', 'Đang gửi...'],
        ['感谢您的咨询！我们的专家团队将在24小时内与您联系。', 'Cảm ơn bạn đã liên hệ! Đội ngũ chuyên gia sẽ phản hồi trong vòng 24 giờ.'],
        ['Home', 'Trang chủ'],
        ['Products', 'Sản phẩm'],
        ['Solutions', 'Giải pháp'],
        ['Cases', 'Khách hàng'],
        ['About', 'Về chúng tôi'],
        ['News', 'Tin tức'],
        ['Support', 'Hỗ trợ'],
        ['Contact', 'Liên hệ'],
        ['Contact Us', 'Liên hệ với chúng tôi'],
        ['Our Products', 'Sản phẩm của chúng tôi'],
        ['Schedule Demo', 'Đặt lịch demo']
    ]).concat(window.BAMI_VI_EXTRA || []);

    var exact = new Map();
    pairs.forEach(function (pair) {
        exact.set(pair[0], pair[1]);
    });

    var textSources = new WeakMap();
    var attributeSources = new WeakMap();
    var htmlSources = new WeakMap();
    var active = false;
    var observer = null;

    function hasChinese(value) {
        return /[\u3400-\u9fff]/.test(value);
    }

    function normalise(value) {
        return value.replace(/\u00a0/g, ' ').replace(/\r\n/g, '\n');
    }

    function translate(value) {
        if (typeof value !== 'string' || !hasChinese(value)) return value;

        var normalised = normalise(value);
        var leading = (normalised.match(/^\s*/) || [''])[0];
        var trailing = (normalised.match(/\s*$/) || [''])[0];
        var core = normalised.trim();
        if (!core) return value;

        if (exact.has(core)) {
            return leading + exact.get(core) + trailing;
        }

        // No partial replacements here: mixing Vietnamese terms into an
        // untranslated Chinese sentence is worse than reporting it in QA.
        return value;
    }

    function shouldSkip(element) {
        return !element || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(element.tagName);
    }

    function translateTextNode(node) {
        if (!node || !node.nodeValue || !hasChinese(node.nodeValue)) return;
        if (!textSources.has(node)) textSources.set(node, node.nodeValue);
        var source = textSources.get(node);
        var translated = translate(source);
        if (node.nodeValue !== translated) node.nodeValue = translated;
    }

    function translateAttributes(element) {
        if (!element || !element.attributes) return;
        var names = ['title', 'alt', 'placeholder', 'aria-label', 'value', 'content'];
        var originals = attributeSources.get(element);
        if (!originals) {
            originals = {};
            attributeSources.set(element, originals);
        }

        names.forEach(function (name) {
            if (!element.hasAttribute(name)) return;
            if (!Object.prototype.hasOwnProperty.call(originals, name)) {
                originals[name] = element.getAttribute(name);
            }
            var source = originals[name];
            var translated = translate(source);
            if (element.getAttribute(name) !== translated) {
                element.setAttribute(name, translated);
            }
        });
    }

    function translateTree(root) {
        if (!root) return;
        if (root.nodeType === Node.TEXT_NODE) {
            translateTextNode(root);
            return;
        }
        if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
        if (root.nodeType === Node.ELEMENT_NODE) {
            if (shouldSkip(root)) return;
            translateAttributes(root);
        }

        var scope = root.nodeType === Node.ELEMENT_NODE ? root : document.documentElement;
        var dataElements = scope.matches && scope.matches('[data-zh]') ? [scope] : [];
        if (scope.querySelectorAll) {
            dataElements = dataElements.concat(Array.from(scope.querySelectorAll('[data-zh]')));
        }
        dataElements.forEach(function (element) {
            if (!htmlSources.has(element)) htmlSources.set(element, element.innerHTML);
            var source = element.getAttribute('data-zh');
            var translated = translate(source);
            if (translated !== source && element.innerHTML !== translated) {
                element.innerHTML = translated;
            }
        });

        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                if (shouldSkip(node.parentElement)) return NodeFilter.FILTER_REJECT;
                return hasChinese(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        });
        while (walker.nextNode()) translateTextNode(walker.currentNode);

        if (root.querySelectorAll) {
            root.querySelectorAll('[title], [alt], [placeholder], [aria-label], [content]').forEach(translateAttributes);
        }
    }

    function restoreTree(root) {
        if (!root) return;
        var scope = root.nodeType === Node.ELEMENT_NODE ? root : document.documentElement;
        if (scope.matches && htmlSources.has(scope)) scope.innerHTML = htmlSources.get(scope);
        if (scope.querySelectorAll) scope.querySelectorAll('*').forEach(function (element) {
            if (htmlSources.has(element)) element.innerHTML = htmlSources.get(element);
        });

        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            var node = walker.currentNode;
            if (textSources.has(node) && node.nodeValue !== textSources.get(node)) {
                node.nodeValue = textSources.get(node);
            }
        }

        if (scope.matches && attributeSources.has(scope)) restoreAttributes(scope);
        if (scope.querySelectorAll) scope.querySelectorAll('*').forEach(function (element) {
            if (attributeSources.has(element)) restoreAttributes(element);
        });
    }

    function restoreAttributes(element) {
        var originals = attributeSources.get(element);
        if (!originals) return;
        Object.keys(originals).forEach(function (name) {
            element.setAttribute(name, originals[name]);
        });
    }

    function startObserver() {
        if (observer || !document.documentElement) return;
        observer = new MutationObserver(function (mutations) {
            if (!active) return;
            mutations.forEach(function (mutation) {
                if (mutation.type === 'characterData') {
                    translateTextNode(mutation.target);
                    return;
                }
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        translateTree(node);
                    }
                });
            });
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function apply(root) {
        active = true;
        startObserver();
        if (!root && document.body) {
            translateTree(document.head);
            translateTree(document.body);
        } else {
            translateTree(root);
        }
    }

    function restore(root) {
        active = false;
        if (root) {
            restoreTree(root);
            return;
        }
        if (document.body) {
            restoreTree(document.body);
            restoreTree(document.head);
        }
    }

    window.BAMI_VI = {
        apply: apply,
        restore: restore,
        translate: translate,
        hasChinese: hasChinese,
        catalog: pairs
    };
})(window, document);
