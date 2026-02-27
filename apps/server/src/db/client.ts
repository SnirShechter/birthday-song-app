import postgres from 'postgres';
import type {
  Order,
  LyricsVariation,
  SongVariation,
  VideoClip,
  Payment,
  AdminStats,
  QuestionnaireAnswers,
  OrderStatus,
  PaymentStatus,
  VideoStatus,
  MusicStyle,
  LyricsModel,
  ProductType,
} from '@birthday-song/shared';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://app:devpassword@localhost:5432/birthday_songs';

export const sql = postgres(DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  transform: {
    column: {
      to: postgres.fromCamel,
      from: postgres.toCamel,
    },
  },
});

// ---------- Row-to-type mappers ----------

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    email: row.email as string | undefined,
    recipientName: row.recipientName as string,
    recipientNickname: row.recipientNickname as string | undefined,
    recipientGender: row.recipientGender as Order['recipientGender'],
    recipientAge: row.recipientAge as number | undefined,
    relationship: row.relationship as string | undefined,
    personalityTraits: row.personalityTraits as string[] | undefined,
    hobbies: row.hobbies as string | undefined,
    funnyStory: row.funnyStory as string | undefined,
    occupation: row.occupation as string | undefined,
    petPeeve: row.petPeeve as string | undefined,
    importantPeople: row.importantPeople as string | undefined,
    sharedMemory: row.sharedMemory as string | undefined,
    desiredMessage: row.desiredMessage as string | undefined,
    desiredTone: row.desiredTone as Order['desiredTone'],
    questionnaireRaw: row.questionnaireRaw as QuestionnaireAnswers,
    language: row.language as Order['language'],
    selectedStyle: row.selectedStyle as MusicStyle | undefined,
    selectedLyricsId: row.selectedLyricsId as number | undefined,
    selectedSongId: row.selectedSongId as number | undefined,
    socialSource: row.socialSource as string | undefined,
    socialData: row.socialData as Order['socialData'],
    status: row.status as OrderStatus,
    referralCode: row.referralCode as string | undefined,
    utmSource: row.utmSource as string | undefined,
    utmMedium: row.utmMedium as string | undefined,
    createdAt: (row.createdAt as Date)?.toISOString?.() ?? (row.createdAt as string),
    updatedAt: (row.updatedAt as Date)?.toISOString?.() ?? (row.updatedAt as string),
  };
}

function mapLyrics(row: Record<string, unknown>): LyricsVariation {
  return {
    id: row.id as number,
    orderId: row.orderId as string,
    model: row.model as LyricsModel,
    styleVariant: row.styleVariant as MusicStyle,
    content: row.content as string,
    selected: row.selected as boolean,
    editedContent: row.editedContent as string | undefined,
    createdAt: (row.createdAt as Date)?.toISOString?.() ?? (row.createdAt as string),
  };
}

function mapSong(row: Record<string, unknown>): SongVariation {
  return {
    id: row.id as number,
    orderId: row.orderId as string,
    provider: row.provider as string,
    providerId: row.providerId as string | undefined,
    stylePrompt: row.stylePrompt as string | undefined,
    audioUrl: row.audioUrl as string | undefined,
    previewUrl: row.previewUrl as string | undefined,
    durationSeconds: row.durationSeconds as number | undefined,
    selected: row.selected as boolean,
    createdAt: (row.createdAt as Date)?.toISOString?.() ?? (row.createdAt as string),
  };
}

function mapVideo(row: Record<string, unknown>): VideoClip {
  return {
    id: row.id as number,
    orderId: row.orderId as string,
    provider: row.provider as string,
    providerId: row.providerId as string | undefined,
    photoUrls: row.photoUrls as string[],
    videoStyle: row.videoStyle as string,
    videoUrl: row.videoUrl as string | undefined,
    status: row.status as VideoStatus,
    createdAt: (row.createdAt as Date)?.toISOString?.() ?? (row.createdAt as string),
    completedAt: row.completedAt
      ? ((row.completedAt as Date)?.toISOString?.() ?? (row.completedAt as string))
      : undefined,
  };
}

function mapPayment(row: Record<string, unknown>): Payment {
  return {
    id: row.id as number,
    orderId: row.orderId as string,
    productType: row.productType as ProductType,
    amountCents: row.amountCents as number,
    currency: row.currency as string,
    stripeSessionId: row.stripeSessionId as string | undefined,
    stripePaymentIntent: row.stripePaymentIntent as string | undefined,
    status: row.status as PaymentStatus,
    createdAt: (row.createdAt as Date)?.toISOString?.() ?? (row.createdAt as string),
    paidAt: row.paidAt
      ? ((row.paidAt as Date)?.toISOString?.() ?? (row.paidAt as string))
      : undefined,
  };
}

// ---------- Database helper object ----------

export const db = {
  // ---- Orders ----
  async getOrder(id: string): Promise<Order | null> {
    const rows = await sql`SELECT * FROM orders WHERE id = ${id}`;
    if (rows.length === 0) return null;
    return mapOrder(rows[0] as unknown as Record<string, unknown>);
  },

  async createOrder(data: {
    id: string;
    recipientName: string;
    recipientNickname?: string;
    recipientGender: string;
    recipientAge?: number;
    relationship?: string;
    personalityTraits?: string[];
    hobbies?: string;
    funnyStory?: string;
    occupation?: string;
    petPeeve?: string;
    importantPeople?: string;
    sharedMemory?: string;
    desiredMessage?: string;
    desiredTone?: string;
    questionnaireRaw: QuestionnaireAnswers;
    language: string;
    email?: string;
    referralCode?: string;
    utmSource?: string;
    utmMedium?: string;
  }): Promise<Order> {
    const rows = await sql`
      INSERT INTO orders (
        id, recipient_name, recipient_nickname, recipient_gender, recipient_age,
        relationship, personality_traits, hobbies, funny_story, occupation,
        pet_peeve, important_people, shared_memory, desired_message, desired_tone,
        questionnaire_raw, language, email, referral_code, utm_source, utm_medium,
        status
      ) VALUES (
        ${data.id},
        ${data.recipientName},
        ${data.recipientNickname ?? null},
        ${data.recipientGender},
        ${data.recipientAge ?? null},
        ${data.relationship ?? null},
        ${data.personalityTraits ? sql.array(data.personalityTraits) : null},
        ${data.hobbies ?? null},
        ${data.funnyStory ?? null},
        ${data.occupation ?? null},
        ${data.petPeeve ?? null},
        ${data.importantPeople ?? null},
        ${data.sharedMemory ?? null},
        ${data.desiredMessage ?? null},
        ${data.desiredTone ?? null},
        ${JSON.stringify(data.questionnaireRaw)},
        ${data.language},
        ${data.email ?? null},
        ${data.referralCode ?? null},
        ${data.utmSource ?? null},
        ${data.utmMedium ?? null},
        'questionnaire_done'
      )
      RETURNING *
    `;
    return mapOrder(rows[0] as unknown as Record<string, unknown>);
  },

  async updateOrder(
    id: string,
    data: Partial<{
      email: string;
      selectedStyle: string;
      selectedLyricsId: number;
      selectedSongId: number;
      status: string;
      socialSource: string;
      socialData: unknown;
    }>,
  ): Promise<Order | null> {
    const sets: string[] = [];
    const values: Record<string, unknown> = {};

    if (data.email !== undefined) {
      values.email = data.email;
    }
    if (data.selectedStyle !== undefined) {
      values.selected_style = data.selectedStyle;
    }
    if (data.selectedLyricsId !== undefined) {
      values.selected_lyrics_id = data.selectedLyricsId;
    }
    if (data.selectedSongId !== undefined) {
      values.selected_song_id = data.selectedSongId;
    }
    if (data.status !== undefined) {
      values.status = data.status;
    }
    if (data.socialSource !== undefined) {
      values.social_source = data.socialSource;
    }
    if (data.socialData !== undefined) {
      values.social_data = JSON.stringify(data.socialData);
    }

    // Build dynamic update using postgres.js
    const rows = await sql`
      UPDATE orders SET
        email = COALESCE(${data.email ?? null}, email),
        selected_style = COALESCE(${data.selectedStyle ?? null}, selected_style),
        selected_lyrics_id = COALESCE(${data.selectedLyricsId ?? null}, selected_lyrics_id),
        selected_song_id = COALESCE(${data.selectedSongId ?? null}, selected_song_id),
        status = COALESCE(${data.status ?? null}, status),
        social_source = COALESCE(${data.socialSource ?? null}, social_source),
        social_data = COALESCE(${data.socialData ? JSON.stringify(data.socialData) : null}::jsonb, social_data)
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return null;
    return mapOrder(rows[0] as unknown as Record<string, unknown>);
  },

  // ---- Lyrics ----
  async getLyrics(orderId: string): Promise<LyricsVariation[]> {
    const rows = await sql`SELECT * FROM lyrics_variations WHERE order_id = ${orderId} ORDER BY id`;
    return rows.map((r) => mapLyrics(r as unknown as Record<string, unknown>));
  },

  async createLyrics(data: {
    orderId: string;
    model: string;
    styleVariant: string;
    content: string;
    selected?: boolean;
  }): Promise<LyricsVariation> {
    const rows = await sql`
      INSERT INTO lyrics_variations (order_id, model, style_variant, content, selected)
      VALUES (${data.orderId}, ${data.model}, ${data.styleVariant}, ${data.content}, ${data.selected ?? false})
      RETURNING *
    `;
    return mapLyrics(rows[0] as unknown as Record<string, unknown>);
  },

  async updateLyrics(
    id: number,
    orderId: string,
    data: { editedContent?: string; selected?: boolean },
  ): Promise<LyricsVariation | null> {
    const rows = await sql`
      UPDATE lyrics_variations SET
        edited_content = COALESCE(${data.editedContent ?? null}, edited_content),
        selected = COALESCE(${data.selected ?? null}, selected)
      WHERE id = ${id} AND order_id = ${orderId}
      RETURNING *
    `;
    if (rows.length === 0) return null;
    return mapLyrics(rows[0] as unknown as Record<string, unknown>);
  },

  // ---- Songs ----
  async getSongs(orderId: string): Promise<SongVariation[]> {
    const rows = await sql`SELECT * FROM song_variations WHERE order_id = ${orderId} ORDER BY id`;
    return rows.map((r) => mapSong(r as unknown as Record<string, unknown>));
  },

  async createSong(data: {
    orderId: string;
    provider: string;
    providerId?: string;
    stylePrompt?: string;
    audioUrl?: string;
    previewUrl?: string;
    durationSeconds?: number;
    selected?: boolean;
  }): Promise<SongVariation> {
    const rows = await sql`
      INSERT INTO song_variations (order_id, provider, provider_id, style_prompt, audio_url, preview_url, duration_seconds, selected)
      VALUES (
        ${data.orderId}, ${data.provider}, ${data.providerId ?? null},
        ${data.stylePrompt ?? null}, ${data.audioUrl ?? null},
        ${data.previewUrl ?? null}, ${data.durationSeconds ?? null},
        ${data.selected ?? false}
      )
      RETURNING *
    `;
    return mapSong(rows[0] as unknown as Record<string, unknown>);
  },

  // ---- Video ----
  async getVideo(orderId: string): Promise<VideoClip | null> {
    const rows = await sql`SELECT * FROM video_clips WHERE order_id = ${orderId} ORDER BY id DESC LIMIT 1`;
    if (rows.length === 0) return null;
    return mapVideo(rows[0] as unknown as Record<string, unknown>);
  },

  async createVideo(data: {
    orderId: string;
    provider: string;
    providerId?: string;
    photoUrls?: string[];
    videoStyle: string;
  }): Promise<VideoClip> {
    const rows = await sql`
      INSERT INTO video_clips (order_id, provider, provider_id, photo_urls, video_style, status)
      VALUES (
        ${data.orderId}, ${data.provider}, ${data.providerId ?? null},
        ${data.photoUrls ? sql.array(data.photoUrls) : sql.array([] as string[])},
        ${data.videoStyle}, 'pending'
      )
      RETURNING *
    `;
    return mapVideo(rows[0] as unknown as Record<string, unknown>);
  },

  async updateVideoStatus(
    id: number,
    status: VideoStatus,
    videoUrl?: string,
  ): Promise<VideoClip | null> {
    const rows = await sql`
      UPDATE video_clips SET
        status = ${status},
        video_url = COALESCE(${videoUrl ?? null}, video_url),
        completed_at = ${status === 'completed' ? sql`NOW()` : sql`completed_at`}
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return null;
    return mapVideo(rows[0] as unknown as Record<string, unknown>);
  },

  // ---- Payments ----
  async createPayment(data: {
    orderId: string;
    productType: string;
    amountCents: number;
    currency?: string;
    stripeSessionId?: string;
  }): Promise<Payment> {
    const rows = await sql`
      INSERT INTO payments (order_id, product_type, amount_cents, currency, stripe_session_id, status)
      VALUES (
        ${data.orderId}, ${data.productType}, ${data.amountCents},
        ${data.currency ?? 'ILS'}, ${data.stripeSessionId ?? null}, 'pending'
      )
      RETURNING *
    `;
    return mapPayment(rows[0] as unknown as Record<string, unknown>);
  },

  async updatePayment(
    stripeSessionId: string,
    data: { status: PaymentStatus; stripePaymentIntent?: string },
  ): Promise<Payment | null> {
    const rows = await sql`
      UPDATE payments SET
        status = ${data.status},
        stripe_payment_intent = COALESCE(${data.stripePaymentIntent ?? null}, stripe_payment_intent),
        paid_at = ${data.status === 'completed' ? sql`NOW()` : sql`paid_at`}
      WHERE stripe_session_id = ${stripeSessionId}
      RETURNING *
    `;
    if (rows.length === 0) return null;
    return mapPayment(rows[0] as unknown as Record<string, unknown>);
  },

  async getPayments(orderId: string): Promise<Payment[]> {
    const rows = await sql`SELECT * FROM payments WHERE order_id = ${orderId} ORDER BY id`;
    return rows.map((r) => mapPayment(r as unknown as Record<string, unknown>));
  },

  // ---- Events ----
  async createEvent(data: {
    orderId?: string;
    eventType: string;
    payload?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await sql`
      INSERT INTO events (order_id, event_type, payload, ip_address, user_agent)
      VALUES (
        ${data.orderId ?? null}, ${data.eventType},
        ${JSON.stringify(data.payload ?? {})},
        ${data.ipAddress ?? null}, ${data.userAgent ?? null}
      )
    `;
  },

  // ---- Stats ----
  async getStats(): Promise<AdminStats> {
    const totalOrdersResult = await sql`SELECT COUNT(*) as count FROM orders`;
    const totalOrders = Number(totalOrdersResult[0].count);

    const completedResult = await sql`SELECT COUNT(*) as count FROM orders WHERE status IN ('paid', 'completed')`;
    const completedOrders = Number(completedResult[0].count);

    const revenueResult = await sql`SELECT COALESCE(SUM(amount_cents), 0) as total FROM payments WHERE status = 'completed'`;
    const totalRevenue = Number(revenueResult[0].total);

    const topStylesResult = await sql`
      SELECT selected_style as style, COUNT(*) as count
      FROM orders
      WHERE selected_style IS NOT NULL
      GROUP BY selected_style
      ORDER BY count DESC
      LIMIT 5
    `;
    const topStyles = topStylesResult.map((r) => ({
      style: r.style as string,
      count: Number(r.count),
    }));

    const recentOrdersResult = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 10`;
    const recentOrders = recentOrdersResult.map((r) =>
      mapOrder(r as unknown as Record<string, unknown>),
    );

    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      conversionRate: totalOrders > 0 ? completedOrders / totalOrders : 0,
      topStyles,
      recentOrders,
    };
  },
};
